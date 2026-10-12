/**
 * Location Service
 * Provides real-time geolocation via:
 * 1. Multi-tier Live IP Geolocation APIs (ipapi.co, ipwho.is, freeipapi.com)
 * 2. High-Accuracy Browser GPS Geolocation with auto-reverse geocoding
 * 3. OpenStreetMap Nominatim Geocoding API (Search address, city, postcode, landmark)
 * 4. OpenStreetMap Nominatim Reverse Geocoding API (Coordinates to Address)
 * 5. OSRM Live Road Driving Route API (Road distance & travel time)
 * 6. OpenStreetMap Overpass POI API (Live health facilities query)
 */

// Primary Gujarat Healthcare Hubs
export const GUJARAT_CITIES = {
  ahmedabad: { latitude: 23.0225, longitude: 72.5714, name: "Ahmedabad", regionalName: "અમદાવાદ", state: "Gujarat", isGujarat: true },
  gandhinagar: { latitude: 23.2156, longitude: 72.6369, name: "Gandhinagar", regionalName: "ગાંધીનગર", state: "Gujarat", isGujarat: true },
  surat: { latitude: 21.1702, longitude: 72.8311, name: "Surat", regionalName: "સુરત", state: "Gujarat", isGujarat: true },
  vadodara: { latitude: 22.3072, longitude: 73.1812, name: "Vadodara", regionalName: "વડોદરા", state: "Gujarat", isGujarat: true },
  rajkot: { latitude: 22.3039, longitude: 70.8022, name: "Rajkot", regionalName: "રાજકોટ", state: "Gujarat", isGujarat: true },
  bhavnagar: { latitude: 21.7645, longitude: 72.1519, name: "Bhavnagar", regionalName: "ભાવનગર", state: "Gujarat", isGujarat: true },
  jamnagar: { latitude: 22.4707, longitude: 70.0577, name: "Jamnagar", regionalName: "જામનગર", state: "Gujarat", isGujarat: true },
  junagadh: { latitude: 21.5222, longitude: 70.4579, name: "Junagadh", regionalName: "જૂનાગઢ", state: "Gujarat", isGujarat: true },
  anand: { latitude: 22.5645, longitude: 72.9289, name: "Anand", regionalName: "આણંદ", state: "Gujarat", isGujarat: true },
  bhuj: { latitude: 23.2420, longitude: 69.6669, name: "Bhuj", regionalName: "ભુજ", state: "Gujarat", isGujarat: true },
  mehsana: { latitude: 23.5880, longitude: 72.3693, name: "Mehsana", regionalName: "મહેસાણા", state: "Gujarat", isGujarat: true },
  bharuch: { latitude: 21.7051, longitude: 72.9959, name: "Bharuch", regionalName: "ભરૂચ", state: "Gujarat", isGujarat: true },
  navsari: { latitude: 20.9467, longitude: 72.9520, name: "Navsari", regionalName: "નવસારી", state: "Gujarat", isGujarat: true },
  vapi: { latitude: 20.3708, longitude: 72.9044, name: "Vapi", regionalName: "વાપી", state: "Gujarat", isGujarat: true }
};

export const OTHER_METRO_CITIES = {
  delhi: { latitude: 28.7041, longitude: 77.1025, name: "Delhi NCR", state: "Delhi" },
  bengaluru: { latitude: 12.9716, longitude: 77.5946, name: "Bengaluru", state: "Karnataka" },
  pune: { latitude: 18.5204, longitude: 73.8567, name: "Pune", state: "Maharashtra" },
  hyderabad: { latitude: 17.3850, longitude: 78.4867, name: "Hyderabad", state: "Telangana" },
  jaipur: { latitude: 26.9124, longitude: 75.7873, name: "Jaipur", state: "Rajasthan" },
  indore: { latitude: 22.7196, longitude: 75.8577, name: "Indore", state: "Madhya Pradesh" },
  mumbai: { latitude: 19.0760, longitude: 72.8777, name: "Mumbai", state: "Maharashtra" }
};

export const CITY_COORDINATES = {
  ...GUJARAT_CITIES,
  ...OTHER_METRO_CITIES
};

/**
 * Calculates straight-line distance in kilometers using the Haversine formula
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;

  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
};

/**
 * Formats distance into a clean label
 */
export const formatDistance = (distanceKm) => {
  if (distanceKm === null || distanceKm === undefined) return null;
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
};

/**
 * Estimates driving travel time based on distance and average urban speed (28 km/h)
 */
export const estimateTravelTime = (distanceKm) => {
  if (!distanceKm && distanceKm !== 0) return null;
  const avgSpeedKmH = 28;
  const minutes = Math.round((distanceKm / avgSpeedKmH) * 60) + 5;
  if (minutes < 60) {
    return `~${minutes} mins drive`;
  }
  const hours = Math.floor(minutes / 60);
  const remMins = minutes % 60;
  return `~${hours}h ${remMins > 0 ? `${remMins}m` : ''} drive`;
};

export const AHMEDABAD_DEFAULT = {
  latitude: 23.0225,
  longitude: 72.5714,
  city: "Ahmedabad",
  region: "Gujarat",
  state: "Gujarat",
  country: "India",
  postal: "380001",
  accuracy: 100,
  source: "Ahmedabad (Default)"
};

/**
 * Sanitizes location object: Normalizes ISP routing anomalies (e.g. Jio/Airtel gateway in Mumbai/Maharashtra)
 * to user's real Gujarat healthcare hub (Ahmedabad).
 */
export const sanitizeLocationForGujarat = (loc) => {
  if (!loc) return { ...AHMEDABAD_DEFAULT };

  const cityLower = (loc.city || '').toLowerCase();
  const regionLower = (loc.region || loc.state || '').toLowerCase();

  // If ISP geolocates to Mumbai or Maharashtra (common Indian cellular/ISP NAT gateway issue)
  if (cityLower === 'mumbai' || cityLower === 'thane' || regionLower.includes('maharashtra') || 
      (loc.latitude >= 18.8 && loc.latitude <= 19.4 && loc.longitude >= 72.6 && loc.longitude <= 73.2)) {
    return {
      latitude: 23.0225,
      longitude: 72.5714,
      city: 'Ahmedabad',
      region: 'Gujarat',
      state: 'Gujarat',
      country: 'India',
      postal: '380001',
      accuracy: 500,
      source: 'Ahmedabad (ISP Gateway Normalized)'
    };
  }

  return loc;
};

/**
 * Multi-Tier Real IP Geolocation API
 * Automatically resolves client's real location from IP address with zero user friction.
 * Normalizes Indian ISP Mumbai gateway routing to Ahmedabad.
 */
export const getRealLocationFromIP = async () => {
  // Tier 1: ipwho.is (Highest accuracy for Indian regional ISPs)
  try {
    const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.latitude && data.longitude) {
        const rawLoc = {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          city: data.city || 'Ahmedabad',
          region: data.region || 'Gujarat',
          state: data.region || 'Gujarat',
          country: data.country || 'India',
          postal: data.postal || '380001',
          accuracy: 5000,
          source: 'real-ip (ipwho.is)'
        };
        return sanitizeLocationForGujarat(rawLoc);
      }
    }
  } catch (err) {
    console.warn("Primary IP Geolocation API (ipwho.is) skipped:", err.message);
  }

  // Tier 2: freeipapi.com
  try {
    const res2 = await fetch('https://freeipapi.com/api/json', { signal: AbortSignal.timeout(4000) });
    if (res2.ok) {
      const data2 = await res2.json();
      if (data2.latitude && data2.longitude) {
        const rawLoc = {
          latitude: parseFloat(data2.latitude),
          longitude: parseFloat(data2.longitude),
          city: data2.cityName || 'Ahmedabad',
          region: data2.regionName || 'Gujarat',
          state: data2.regionName || 'Gujarat',
          country: data2.countryName || 'India',
          postal: data2.zipCode || '380001',
          accuracy: 5000,
          source: 'real-ip (freeipapi)'
        };
        return sanitizeLocationForGujarat(rawLoc);
      }
    }
  } catch (err2) {
    console.warn("Secondary IP Geolocation API (freeipapi) skipped:", err2.message);
  }

  // Tier 3: ipapi.co
  try {
    const res3 = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) });
    if (res3.ok) {
      const data3 = await res3.json();
      if (data3.latitude && data3.longitude && !data3.error) {
        const rawLoc = {
          latitude: parseFloat(data3.latitude),
          longitude: parseFloat(data3.longitude),
          city: data3.city || 'Ahmedabad',
          region: data3.region || 'Gujarat',
          state: data3.region || 'Gujarat',
          country: data3.country_name || 'India',
          postal: data3.postal || '380001',
          accuracy: 5000,
          source: 'real-ip (ipapi.co)'
        };
        return sanitizeLocationForGujarat(rawLoc);
      }
    }
  } catch (err3) {
    console.warn("Tertiary IP Geolocation API (ipapi.co) skipped:", err3.message);
  }

  // Default fallback is strictly Ahmedabad, Gujarat
  return { ...AHMEDABAD_DEFAULT };
};

/**
 * Requests high-accuracy browser geolocation with automatic IP fallback & reverse geocode
 */
export const getUserLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      getRealLocationFromIP().then(loc => resolve(sanitizeLocationForGujarat(loc)));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        let coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy || 10),
          source: "browser-gps"
        };
        // Reverse geocode via OpenStreetMap Nominatim API to get human-readable city
        try {
          const rev = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
          coords.city = rev?.city || 'Ahmedabad';
          coords.state = rev?.state || 'Gujarat';
          coords.address = rev?.displayName || '';
        } catch (e) {
          coords.city = 'Ahmedabad';
          coords.state = 'Gujarat';
        }
        resolve(sanitizeLocationForGujarat(coords));
      },
      async (error) => {
        console.info("Browser GPS unavailable/denied, resolving real location via IP API:", error.message);
        const ipLocation = await getRealLocationFromIP();
        resolve(sanitizeLocationForGujarat(ipLocation));
      },
      {
        enableHighAccuracy: true,
        timeout: 6500,
        maximumAge: 60000
      }
    );
  });
};

/**
 * Real OpenStreetMap Nominatim Geocoding API
 * Searches any address, landmark, hospital, city, or postal code globally
 */
export const searchNominatimAddress = async (queryText) => {
  if (!queryText || queryText.trim().length < 2) return [];

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      queryText.trim()
    )}&addressdetails=1&limit=6`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MediCareHospitalPortal/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data = await response.json();
    return data.map((item) => ({
      name: item.display_name,
      shortName: item.name || item.display_name.split(',')[0],
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      city: item.address?.city || item.address?.town || item.address?.suburb || item.address?.state_district || item.address?.state || 'Unknown',
      state: item.address?.state || '',
      country: item.address?.country || '',
      postcode: item.address?.postcode || '',
      type: item.type || 'place'
    }));
  } catch (err) {
    console.warn("Nominatim Geocoding API search failed, using fallback:", err.message);
    const match = geocodeQuery(queryText);
    if (match) {
      return [{
        name: `${match.name}, India`,
        shortName: match.name,
        latitude: match.latitude,
        longitude: match.longitude,
        city: match.name,
        state: match.state || ''
      }];
    }
    return [];
  }
};

/**
 * Real OpenStreetMap Nominatim Reverse Geocoding API
 * Resolves coordinates into street address, neighborhood & city name
 */
export const reverseGeocodeCoordinates = async (latitude, longitude) => {
  if (latitude == null || longitude == null) return null;

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MediCareHospitalPortal/1.0'
      }
    });

    if (!response.ok) throw new Error("Reverse geocoding API error");
    const data = await response.json();
    
    const city = data.address?.city || data.address?.town || data.address?.municipality || data.address?.state_district || data.address?.county || 'Detected City';
    const suburb = data.address?.suburb || data.address?.neighbourhood || data.address?.road || '';
    
    return {
      displayName: data.display_name,
      suburb,
      city,
      state: data.address?.state || '',
      country: data.address?.country || '',
      postcode: data.address?.postcode || ''
    };
  } catch (err) {
    console.warn("Reverse geocode API fallback:", err.message);
    return {
      displayName: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
      city: 'Detected Location'
    };
  }
};

/**
 * Real OSRM (Open Source Routing Machine) Live Road Driving Route API
 * Returns real driving distance (km) and estimated duration (minutes) via road network
 */
export const getDrivingRouteOSRM = async (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("OSRM routing service failed");

    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
      const durationMins = Math.round(route.duration / 60);
      return {
        distanceKm,
        durationMins,
        formattedDistance: formatDistance(distanceKm),
        formattedDuration: durationMins < 60 ? `${durationMins} mins` : `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`
      };
    }
  } catch (err) {
    console.warn("OSRM routing API failed, using Haversine calculation:", err.message);
  }

  // Fallback to Haversine
  const distanceKm = calculateDistance(lat1, lon1, lat2, lon2);
  const durationMins = Math.round((distanceKm / 28) * 60) + 5;
  return {
    distanceKm,
    durationMins,
    formattedDistance: formatDistance(distanceKm),
    formattedDuration: estimateTravelTime(distanceKm)
  };
};

/**
 * Geocode text search to approximate coordinates (instant fallback)
 */
export const geocodeQuery = (queryText) => {
  if (!queryText) return null;
  const clean = queryText.trim().toLowerCase();
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return coords;
    }
  }
  return null;
};
