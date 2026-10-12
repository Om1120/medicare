const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const outputDir = path.join(__dirname, 'all_images');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Subfolders inside all_images
const subdirs = ['logos', 'hospitals', 'doctors', 'departments', 'facilities'];
subdirs.forEach(sd => {
  const p = path.join(outputDir, sd);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

function sanitizeFilename(name) {
  return name.toLowerCase().replace(/[^a-z0-9_-]/g, '_').replace(/_+/g, '_').slice(0, 50);
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      // already downloaded
      return resolve(destPath);
    }

    const file = fs.createWriteStream(destPath);
    const client = url.startsWith('https') ? https : http;

    client.get(url, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return downloadImage(response.headers.location, destPath).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return reject(new Error(`Failed to download ${url}: Status ${response.statusCode}`));
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close(() => resolve(destPath));
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

async function run() {
  console.log('Reading data files...');
  const hospitals = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/hospitals.json'), 'utf8'));
  const doctors = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/doctors.json'), 'utf8'));
  const departments = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/departments.json'), 'utf8'));
  const facilities = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/facilities.json'), 'utf8'));

  const downloadQueue = [];
  const manifest = [];

  // 1. Hospital Logos
  hospitals.forEach((h, idx) => {
    const slug = sanitizeFilename(h.name || `hospital_${idx + 1}`);
    if (h.logo) {
      const filename = `logo_${h.id || idx + 1}_${slug}.jpg`;
      const dest = path.join(outputDir, 'logos', filename);
      const rootDest = path.join(outputDir, filename);
      downloadQueue.push({ url: h.logo, dest, rootDest, title: `${h.name} - Logo`, type: 'Hospital Logo' });
      manifest.push({ type: 'Hospital Logo', id: h.id, name: h.name, filename, path: `logos/${filename}` });
    }

    if (h.image) {
      const filename = `hospital_${h.id || idx + 1}_${slug}_main.jpg`;
      const dest = path.join(outputDir, 'hospitals', filename);
      const rootDest = path.join(outputDir, filename);
      downloadQueue.push({ url: h.image, dest, rootDest, title: `${h.name} - Main Building`, type: 'Hospital Main' });
      manifest.push({ type: 'Hospital Main Image', id: h.id, name: h.name, filename, path: `hospitals/${filename}` });
    }

    if (Array.isArray(h.gallery)) {
      h.gallery.forEach((gUrl, gIdx) => {
        const filename = `hospital_${h.id || idx + 1}_${slug}_gallery_${gIdx + 1}.jpg`;
        const dest = path.join(outputDir, 'hospitals', filename);
        const rootDest = path.join(outputDir, filename);
        downloadQueue.push({ url: gUrl, dest, rootDest, title: `${h.name} - Gallery ${gIdx + 1}`, type: 'Hospital Gallery' });
        manifest.push({ type: 'Hospital Gallery', id: h.id, name: h.name, filename, path: `hospitals/${filename}` });
      });
    }
  });

  // 2. Doctor Profiles
  doctors.forEach((doc, idx) => {
    const slug = sanitizeFilename(doc.name || `doctor_${idx + 1}`);
    if (doc.image) {
      const filename = `doctor_${doc.id || idx + 1}_${slug}.jpg`;
      const dest = path.join(outputDir, 'doctors', filename);
      const rootDest = path.join(outputDir, filename);
      downloadQueue.push({ url: doc.image, dest, rootDest, title: `${doc.name} (${doc.specialization})`, type: 'Doctor' });
      manifest.push({ type: 'Doctor Portrait', id: doc.id, name: doc.name, specialization: doc.specialization, filename, path: `doctors/${filename}` });
    }
  });

  // 3. Departments
  departments.forEach((dept, idx) => {
    const slug = sanitizeFilename(dept.name || `department_${idx + 1}`);
    if (dept.image) {
      const filename = `department_${dept.id || idx + 1}_${slug}.jpg`;
      const dest = path.join(outputDir, 'departments', filename);
      const rootDest = path.join(outputDir, filename);
      downloadQueue.push({ url: dept.image, dest, rootDest, title: `${dept.name} Department`, type: 'Department' });
      manifest.push({ type: 'Department', id: dept.id, name: dept.name, filename, path: `departments/${filename}` });
    }
  });

  // 4. Facilities
  facilities.forEach((fac, idx) => {
    const slug = sanitizeFilename(fac.name || `facility_${idx + 1}`);
    if (fac.image) {
      const filename = `facility_${fac.id || idx + 1}_${slug}.jpg`;
      const dest = path.join(outputDir, 'facilities', filename);
      const rootDest = path.join(outputDir, filename);
      downloadQueue.push({ url: fac.image, dest, rootDest, title: `${fac.name} Facility`, type: 'Facility' });
      manifest.push({ type: 'Facility', id: fac.id, name: fac.name, filename, path: `facilities/${filename}` });
    }
  });

  console.log(`Starting downloads for ${downloadQueue.length} images & logos...`);

  let successCount = 0;
  for (let i = 0; i < downloadQueue.length; i++) {
    const item = downloadQueue[i];
    try {
      await downloadImage(item.url, item.dest);
      // Also copy to root of all_images so all items are in one single folder directly accessible
      fs.copyFileSync(item.dest, item.rootDest);
      successCount++;
      process.stdout.write(`[${successCount}/${downloadQueue.length}] Downloaded: ${path.basename(item.dest)}\n`);
    } catch (err) {
      console.error(`Failed ${item.title}: ${err.message}`);
    }
  }

  // Create MediCare SVG & raster logo
  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="medicareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B6E99" />
      <stop offset="100%" stop-color="#16A6A3" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="110" fill="url(#medicareGrad)" />
  <g fill="none" stroke="#ffffff" stroke-width="32" stroke-linecap="round" stroke-linejoin="round">
    <path d="M380 300c28-28 56-62 56-106 0-58-46-94-106-94-34 0-58 10-90 40-32-30-56-40-90-40-60 0-106 36-106 94 0 44 28 78 56 106l140 140Z" />
    <path d="M240 120v260" stroke-width="36" />
    <path d="M110 250h260" stroke-width="36" />
  </g>
</svg>`;

  fs.writeFileSync(path.join(outputDir, 'logos', 'medicare_brand_logo.svg'), logoSvg);
  fs.writeFileSync(path.join(outputDir, 'medicare_brand_logo.svg'), logoSvg);

  // Write Manifest
  fs.writeFileSync(path.join(outputDir, 'images_manifest.json'), JSON.stringify(manifest, null, 2));

  // Write descriptive Markdown
  const mdContent = `# MediCare Hospital - Downloaded Images and Logos

All hospital logos, medical center images, doctor portrait photos, facilities, and departments are downloaded and stored in this folder.

## Folder Contents
- **Total Downloaded Files**: ${successCount} images (.jpg and .svg)
- **Direct Directory**: \`e:\\FP\\Hospital\\all_images\\\` (All files directly accessible in this one folder)
- **Categorized Subfolders**:
  - \`all_images/logos/\`: Hospital logos & MediCare brand logo
  - \`all_images/hospitals/\`: Hospital main exterior buildings & interior clinical facilities
  - \`all_images/doctors/\`: Medical doctors & surgical specialist portrait photos
  - \`all_images/departments/\`: Clinical department representations
  - \`all_images/facilities/\`: Diagnostic labs, ICUs, operation theatres, and blood bank

Generated on: ${new Date().toISOString()}
`;
  fs.writeFileSync(path.join(outputDir, 'README.md'), mdContent);

  console.log(`\nAll done! Successfully downloaded ${successCount} image files into e:\\FP\\Hospital\\all_images.`);
}

run().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
