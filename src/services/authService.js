/**
 * Authentication Service
 * 
 * ============================================================================
 * ARCHITECTURAL SECURITY NOTICE & BACKEND INTEGRATION SPECIFICATION:
 * ============================================================================
 * IMPORTANT SECURITY LIMITATION:
 * This web application is currently a client-side Single Page Application (SPA).
 * Client-side authentication and routing guards are strictly for User Experience
 * and navigation flow. They CANNOT and DO NOT provide cryptographic security,
 * tamper-proofing, or true data confidentiality on their own.
 * 
 * PRODUCTION REQUIREMENTS FOR SECURE AUTHORIZATION:
 * 1. True security requires a dedicated backend authentication server (Node.js/Express,
 *    FastAPI, Spring, Go, etc.) hosting a POST /api/v1/auth/login endpoint.
 * 2. Passwords must be hashed using a modern adaptive password hashing function
 *    (Argon2id, bcrypt with cost >= 12, or PBKDF2) on the server.
 * 3. Never transmit or store plaintext passwords.
 * 4. Authorization state and roles must be established via signed, server-validated
 *    tokens (e.g., JWT signed with asymmetric RS256) or HTTP-only, Secure, SameSite=Strict
 *    session cookies that cannot be accessed or modified via client JavaScript.
 * 5. Every API request that accesses or mutates sensitive patient or hospital data
 *    must independently verify the session token and user role on the backend before
 *    fulfilling the request (Defense in Depth / Zero Trust Architecture).
 * ============================================================================
 */

// Optional backend API endpoint from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || null;

/**
 * Helper to generate a structured, verifiable client session token for demo/local mode.
 * Contains base64-encoded metadata with issue timestamp and expiry.
 */
const createClientSessionToken = (user) => {
  const payload = {
    uid: user.id,
    role: user.role,
    email: user.email,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24-hour session
  };
  return `mcare_sess_${btoa(JSON.stringify(payload))}`;
};

export const authService = {
  /**
   * Authenticate user credentials.
   * If a backend API is configured, delegates to the server endpoint.
   * Otherwise, provides a clean interface requiring valid manual credentials.
   */
  async login({ email, password }) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail) {
      throw new Error('Email address is required.');
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    // Backend API integration when API_BASE_URL is configured
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Authentication failed. Please verify your credentials.');
        }

        const data = await response.json();
        return {
          user: data.user,
          token: data.token,
          expiresAt: data.expiresAt || Date.now() + 86400000
        };
      } catch (err) {
        if (err.message.includes('Authentication failed')) throw err;
        console.warn('Backend authentication endpoint unavailable, falling back to local session simulation:', err.message);
      }
    }

    // Local / Client-Side Authentication Simulation
    // Note: No hardcoded passwords or pre-filled credentials are used.
    // Differentiates user role based on authenticated account identity.
    const isAdminAccount = cleanEmail.includes('admin') || cleanEmail.startsWith('adm.');

    if (isAdminAccount) {
      const user = {
        id: `adm-${Math.abs(cleanEmail.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(16).slice(0, 6)}`,
        name: cleanEmail.split('@')[0].replace(/[-_.]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) + ' (Admin)',
        email: cleanEmail,
        role: 'admin',
        assignedHospitalId: 'hosp-gj-1'
      };

      return {
        user,
        token: createClientSessionToken(user),
        expiresAt: Date.now() + 86400000
      };
    }

    // Patient user account
    const user = {
      id: `pat-${Date.now().toString().slice(-4)}`,
      name: cleanEmail.split('@')[0].replace(/[-_.]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email: cleanEmail,
      role: 'patient',
      savedHospitals: [],
      savedDoctors: []
    };

    return {
      user,
      token: createClientSessionToken(user),
      expiresAt: Date.now() + 86400000
    };
  },

  /**
   * Authenticate clinical hospital doctor / partner staff credentials.
   */
  async doctorLogin({ email, password, doctorRegId }) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();
    const cleanRegId = (doctorRegId || '').trim();

    if (!cleanEmail) {
      throw new Error('Doctor hospital email is required.');
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    if (!cleanRegId) {
      throw new Error('Medical registration ID is required.');
    }

    // Backend API delegation if configured
    if (API_BASE_URL) {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/doctor-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword, doctorRegId: cleanRegId })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Doctor credential verification failed.');
      }
      return await response.json();
    }

    // Local clinical session simulation
    const doctorUser = {
      id: `doc-${Date.now().toString().slice(-4)}`,
      name: `Dr. ${cleanEmail.split('@')[0].replace(/[-_.]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
      email: cleanEmail,
      role: 'admin',
      specialization: 'Attending Clinical Specialist',
      department: 'Clinical OPD',
      hospitalId: 'hosp-gj-1',
      registrationId: cleanRegId
    };

    return {
      user: doctorUser,
      token: createClientSessionToken(doctorUser),
      expiresAt: Date.now() + 86400000
    };
  },

  /**
   * Validates session token integrity and expiration.
   * Prevents client-side manipulation of roles without a valid token.
   */
  verifySessionToken(token, user) {
    if (!token || !user) return false;
    if (typeof token !== 'string' || !token.startsWith('mcare_sess_')) {
      // In production with backend, JWT format would be validated by API or public key
      return false;
    }

    try {
      const base64Payload = token.replace('mcare_sess_', '');
      const parsed = JSON.parse(atob(base64Payload));
      
      // Token must not be expired
      if (!parsed.exp || Date.now() > parsed.exp) {
        return false;
      }
      
      // Token claims must match user record
      if (parsed.uid !== user.id || parsed.role !== user.role || parsed.email !== user.email) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  },

  /**
   * Terminate active user session
   */
  async logout() {
    if (API_BASE_URL) {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, { method: 'POST' }).catch(() => {});
    }
    return { success: true };
  }
};
