import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, 
  Bone, 
  Baby, 
  Activity, 
  Smile, 
  Stethoscope, 
  Sparkles, 
  Users, 
  ArrowRight,
  UserCheck,
  MapPin
} from 'lucide-react';

const iconMap = {
  HeartPulse: HeartPulse,
  Bone: Bone,
  Baby: Baby,
  Activity: Activity,
  Smile: Smile,
  Stethoscope: Stethoscope,
  Sparkles: Sparkles,
  Users: Users
};

const DepartmentCard = ({ department }) => {
  const { id, name, description, headDoctor, doctorCount, image, icon, location } = department;
  const IconComponent = iconMap[icon] || HeartPulse;

  return (
    <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
        <img
          src={image || 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=600&q=80'}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-dark)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <IconComponent size={22} color="#16A6A3" />
        </div>
      </div>

      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '0.45rem' }}>
          {name}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1rem' }}>
          {description}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-body)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <UserCheck size={15} color="var(--primary)" />
            <span>Head: <strong>{headDoctor}</strong></span>
          </div>
          {location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
              <MapPin size={15} color="var(--teal)" />
              <span>{location}</span>
            </div>
          )}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="badge badge-info">
            {doctorCount || 3} Specialist Doctors
          </span>
          <Link
            to={`/doctors?department=${encodeURIComponent(name)}`}
            className="btn btn-outline-primary btn-sm"
            style={{ padding: '0.35rem 0.75rem' }}
          >
            <span>View Doctors</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DepartmentCard;
