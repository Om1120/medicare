import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorState = ({
  title = "Unable to load information",
  message = "A temporary connection or data retrieval issue occurred. Please try again.",
  onRetry
}) => {
  return (
    <div
      className="card"
      style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '1.5rem 0',
        borderColor: 'var(--danger)',
        backgroundColor: '#fffcfc'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--danger-bg)',
          color: 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}
      >
        <AlertTriangle size={28} />
      </div>

      <h3 style={{ fontSize: '1.25rem', color: 'var(--danger)', marginBottom: '0.4rem' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-body)', fontSize: '0.92rem', maxWidth: '460px', marginBottom: onRetry ? '1.25rem' : 0 }}>
        {message}
      </p>

      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-outline-primary btn-sm">
          <RefreshCw size={15} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
