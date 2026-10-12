import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Building2, 
  GraduationCap, 
  Clock, 
  Calendar, 
  Scale, 
  Check, 
  ArrowRight,
  Languages,
  Star
} from 'lucide-react';
import { addDoctorToCompare, removeDoctorFromCompare } from '../redux/slices/comparisonSlice';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

const DoctorCard = ({ doctor }) => {
  const dispatch = useDispatch();
  const { doctorIds: compareList } = useSelector(state => state.comparison);
  const isCompared = compareList.includes(doctor.id);

  const handleCompareToggle = (e) => {
    e.stopPropagation();
    if (isCompared) {
      dispatch(removeDoctorFromCompare(doctor.id));
      toast.success(`Removed ${doctor.name} from comparison.`);
    } else {
      if (compareList.length >= 4) {
        toast.error('You can compare up to 4 doctors simultaneously.');
        return;
      }
      dispatch(addDoctorToCompare(doctor.id));
      toast.success(`Added ${doctor.name} to comparison.`);
    }
  };

  return (
    <article className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Top Image & Department Badge */}
      <div style={{ position: 'relative', height: '195px', overflow: 'hidden', backgroundColor: '#E2E8F0' }}>
        <img
          src={doctor.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'}
          alt={doctor.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'rgba(15, 45, 72, 0.9)',
            color: '#ffffff',
            padding: '0.22rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: '700',
            letterSpacing: '0.4px',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
          }}
        >
          {doctor.department}
        </div>

        {/* Rating Pill */}
        {doctor.rating && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '0.18rem 0.5rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.74rem',
              fontWeight: '800',
              color: 'var(--primary-dark)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
            }}
          >
            <Star size={12} fill="#F59E0B" color="#F59E0B" />
            <span>{doctor.rating}</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1.25rem' }}>
        {/* Hospital Affiliation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.3rem' }}>
          <Building2 size={13} style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {doctor.hospitalName || "Multi-Hospital Specialist"}
          </span>
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '0.2rem', lineHeight: '1.28' }}>
          <Link to={`/doctors/${doctor.id}`} style={{ color: 'inherit' }}>
            {doctor.name}
          </Link>
        </h3>
        <p style={{ color: 'var(--teal)', fontWeight: '700', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
          {doctor.specialization}
        </p>

        {/* Credentials & Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <GraduationCap size={13} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span style={{ color: 'var(--text-body)', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {doctor.qualification}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Clock size={13} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span>{doctor.experience} Experience</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Calendar size={13} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span>{Array.isArray(doctor.availableDays) ? doctor.availableDays.slice(0, 3).join(', ') : doctor.availableDays}</span>
          </div>
        </div>

        {/* Pricing and Action Buttons */}
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Consultation</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-dark)' }}>
                {formatCurrency(doctor.fee)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCompareToggle}
              style={{
                background: isCompared ? 'var(--primary-light)' : 'none',
                border: '1px solid',
                borderColor: isCompared ? 'var(--primary)' : 'var(--border)',
                color: isCompared ? 'var(--primary)' : 'var(--text-body)',
                fontSize: '0.76rem',
                fontWeight: '700',
                padding: '0.3rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.15s ease'
              }}
            >
              {isCompared ? <Check size={12} color="var(--primary)" /> : <Scale size={12} />}
              <span>{isCompared ? "In Compare" : "Compare"}</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.45rem' }}>
            <Link to={`/doctors/${doctor.id}`} className="btn btn-outline-primary btn-sm" style={{ flex: 1 }}>
              Profile
            </Link>
            <Link to={`/book-appointment?doctorId=${doctor.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              <span>Book Slot</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default DoctorCard;
