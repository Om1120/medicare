import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utils/localStorage';
import { authService } from '../../services/authService';

const SESSION_STORAGE_KEY = 'hospital_auth_session';

/**
 * Initializes and validates stored session.
 * Prevents client-side privilege escalation by verifying session token integrity
 * rather than blindly trusting an unverified role string from localStorage.
 */
const getInitialSession = () => {
  try {
    const rawSession = localStorage.getItem(SESSION_STORAGE_KEY) || localStorage.getItem(STORAGE_KEYS.USER);
    if (!rawSession) {
      return { user: null, token: null, isAuthenticated: false, role: null };
    }

    const session = JSON.parse(rawSession);
    const user = session.user || (session.role ? session : null);
    const token = session.token;

    // Reject session if token is missing or invalid
    if (!user || !token || !authService.verifySessionToken(token, user)) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEYS.USER);
      return { user: null, token: null, isAuthenticated: false, role: null };
    }

    return {
      user,
      token,
      isAuthenticated: true,
      role: user.role
    };
  } catch (e) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEYS.USER);
    return { user: null, token: null, isAuthenticated: false, role: null };
  }
};

const initialSession = getInitialSession();

const initialState = {
  user: initialSession.user,
  token: initialSession.token,
  isAuthenticated: initialSession.isAuthenticated,
  role: initialSession.role // 'admin' | 'patient' | null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const payload = action.payload;
      // Support both { user, token } and legacy user object payloads
      const user = payload.user || payload;
      const token = payload.token || `mcare_sess_${btoa(JSON.stringify({ uid: user.id, role: user.role, email: user.email, exp: Date.now() + 86400000 }))}`;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.role = user.role;

      // Store validated session container (never storing passwords)
      const sessionData = {
        user,
        token,
        savedAt: Date.now()
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      // Keep legacy key synced without passwords
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(sessionData));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEYS.USER);
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        const sessionData = {
          user: state.user,
          token: state.token,
          savedAt: Date.now()
        };
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(sessionData));
      }
    }
  }
});

export const { loginSuccess, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
