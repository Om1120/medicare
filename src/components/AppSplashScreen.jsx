import React from 'react';
import { HeartPulse } from 'lucide-react';

const AppSplashScreen = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        transition: 'opacity 0.4s ease-out'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          animation: 'logoScalePulse 1.8s ease-in-out infinite'
        }}
      >
        {/* MediCare Emblemed Logo */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #0B6E99 0%, #16A6A3 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 16px 36px rgba(11, 110, 153, 0.35)'
          }}
        >
          <HeartPulse size={44} strokeWidth={2.4} />
        </div>

        {/* Brand Name */}
        <div
          style={{
            fontSize: '1.85rem',
            fontWeight: '800',
            color: '#0c4a6e',
            letterSpacing: '-0.5px',
            fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}
        >
          MediCare
        </div>
      </div>

      <style>{`
        @keyframes logoScalePulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.88;
          }
        }
      `}</style>
    </div>
  );
};

export default AppSplashScreen;
