import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute Component
 * 
 * ============================================================================
 * SECURITY ARCHITECTURE NOTICE:
 * ============================================================================
 * Frontend route guards in Single Page Applications (SPAs) are designed for
 * user interface navigation flow and preventing accidental client-side view rendering.
 * 
 * They DO NOT provide standalone cryptographic data security because any code
 * running in a user's browser can be inspected or modified via DevTools.
 * 
 * In a secure production architecture:
 * 1. The backend API must independently authenticate every request using signed,
 *    tamper-proof session tokens (JWT or HTTP-only Secure SameSite session cookies).
 * 2. The backend must enforce server-side Role-Based Access Control (RBAC) on
 *    every privileged endpoint (e.g. POST /api/admin/hospitals, GET /api/patients).
 * 3. Frontend route guards and backend access controls operate together as
 *    Defense in Depth.
 * ============================================================================
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, user } = useSelector(state => state.auth);
  const location = useLocation();

  // 1. Unauthenticated users are redirected to the Login page with the return URL preserved
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Authenticated users without the required authorization role are redirected to Unauthorized (403)
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          from: location,
          requiredRoles: allowedRoles,
          currentRole: role
        }}
        replace
      />
    );
  }

  // 3. User is authenticated and possesses the authorized role
  return children;
};

export default ProtectedRoute;
