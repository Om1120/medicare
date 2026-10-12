import React from 'react';
import { CheckCircle2, Clock, Users } from 'lucide-react';

const FacilityCard = ({ facility }) => {
  const { name, category, description, capacity, availability, image, features } = facility;

  return (
    <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img
          src={image || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80'}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'rgba(18, 59, 93, 0.9)',
            color: '#ffffff',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: '700'
          }}
        >
          {category}
        </div>
      </div>

      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1.35rem' }}>
        <h3 style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '0.45rem' }}>
          {name}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1rem' }}>
          {description}
        </p>

        {features && features.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-dark)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
              Key Features
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {features.map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-body)' }}>
                  <CheckCircle2 size={13} color="var(--teal)" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
            <Users size={14} color="var(--primary)" />
            <span>{capacity}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--teal)', fontWeight: '600' }}>
            <Clock size={14} />
            <span>{availability}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityCard;
