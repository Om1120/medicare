# MediCare Hospital — Advanced Healthcare & Hospital Management Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FOm1120%2Fmedicare)

MediCare is a healthcare network platform and clinical management web application built with **React 18**, **Vite**, and **Redux Toolkit**. It provides hospital directory search across Gujarat (Ahmedabad, Surat, Vadodara, Rajkot, Bhavnagar, Jamnagar, Bhuj), doctor booking, patient health portals, administrative consoles, and diagnostic records management.

---

## 🚀 Live Deployment on Vercel

You can deploy this repository directly to Vercel in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FOm1120%2Fmedicare)

### Manual 1-Minute Steps:
1. Go to [vercel.com/new](https://vercel.com/new).
2. Sign in with your GitHub account (**Om1120**).
3. Find and click **Import** next to `Om1120/medicare`.
4. Leave Framework Preset as **Vite** (Root Directory `./`).
5. Click **Deploy**. Vercel will build and assign your live URL (e.g. `https://medicare-eta.vercel.app`).

*Note: SPA client-side routing is pre-configured via [`vercel.json`](./vercel.json) to ensure routes like `/patient/dashboard` and `/admin/dashboard` resolve correctly.*

---

## 🌟 Key Features

- **Hospital Directory & Real GPS Proximity**: Search accredited hospitals with real-time distance calculation, PMJAY-MA cashless filters, emergency 24x7 status, and interactive OpenStreetMap integration.
- **Specialist Doctor Scheduling**: Browse certified physicians, surgeons, pediatricians, and cardiologists with instant OPD slot reservations.
- **Patient Health Portal (`/patient/dashboard`)**:
  - Upcoming consultation ticket cards.
  - Outstanding medical invoices and instant billing reviews.
  - Diagnostic reports and medical record history.
  - Saved hospital and specialist bookmarks.
- **Healthcare Platform Administration (`/admin/dashboard`)**:
  - Hospital data management.
  - Specialist doctor profiles and department allocations.
  - Revenue trends and appointment analytics with Recharts.
  - Inpatient ward occupancy tracking.
- **AI Health Assistant**: Smart symptom evaluator and clinical guidance triage.
- **Offline & Responsive**: Fully responsive across mobile, tablet, and desktop viewports.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 5
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM v6
- **Forms & Validation**: Formik, Yup
- **Data Visualization**: Recharts
- **Icons & Styling**: Lucide React, Modern CSS Design System
- **Notifications**: React Hot Toast

---

## 💻 Local Development

```bash
# 1. Clone repository
git clone https://github.com/Om1120/medicare.git

# 2. Navigate to directory
cd medicare

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

---

## 🔐 Demo Credentials

| Role | Email | Password | Default Redirect |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@medicare.health` | `admin123` | `/admin/dashboard` |
| **Patient** | `patient@medicare.health` | `patient123` | `/patient/dashboard` |

*Quick demo credentials can also be autofilled directly on the `/login` screen.*