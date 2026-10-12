import React from 'react';

export const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', width: '100%' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="card"
          style={{
            padding: '1.5rem',
            animation: 'pulse 1.5s infinite ease-in-out',
            backgroundColor: '#ffffff'
          }}
        >
          <div style={{ width: '100%', height: '160px', backgroundColor: '#e2e8f0', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }} />
          <div style={{ width: '65%', height: '22px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '0.75rem' }} />
          <div style={{ width: '90%', height: '16px', backgroundColor: '#f1f5f9', borderRadius: '4px', marginBottom: '0.5rem' }} />
          <div style={{ width: '45%', height: '16px', backgroundColor: '#f1f5f9', borderRadius: '4px', marginBottom: '1.25rem' }} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ flex: 1, height: '38px', backgroundColor: '#e2e8f0', borderRadius: 'var(--radius-sm)' }} />
            <div style={{ flex: 1, height: '38px', backgroundColor: '#e2e8f0', borderRadius: 'var(--radius-sm)' }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
