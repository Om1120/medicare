import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  Heart, 
  Droplets, 
  Scan, 
  Cpu, 
  Radio, 
  ShieldCheck, 
  AlertCircle, 
  Eye, 
  Sparkles,
  Clock,
  ArrowRight
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const iconMap = {
  Stethoscope: Stethoscope,
  Heart: Heart,
  Droplets: Droplets,
  Scan: Scan,
  Cpu: Cpu,
  Radio: Radio,
  ShieldCheck: ShieldCheck,
  AlertCircle: AlertCircle,
  Eye: Eye,
  Sparkles: Sparkles
};

const ServiceCard = ({ service }) => {
  const { name, category, description, price, duration, status, icon } = service;
  const IconComponent = iconMap[icon] || Stethoscope;

  return (
    <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <IconComponent size={24} />
        </div>
        <span className="badge badge-neutral" style={{ textTransform: 'uppercase', fontSize: '0.72rem' }}>
          {category}
        </span>
      </div>

      <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '0.45rem' }}>
        {name}
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
        {description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--text-body)', marginBottom: '1.25rem' }}>
        <Clock size={15} color="var(--teal)" />
        <span>Turnaround: <strong>{duration || 'Same Day'}</strong></span>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Package Fee</span>
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-dark)' }}>
            {formatCurrency(price)}
          </span>
        </div>
        <Link to="/book-appointment" className="btn btn-outline-primary btn-sm">
          <span>Inquire</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
