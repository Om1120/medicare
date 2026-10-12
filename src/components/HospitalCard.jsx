import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  MapPin, 
  ShieldCheck, 
  Activity, 
  Bed, 
  Clock, 
  PhoneCall, 
  Scale, 
  Check, 
  Calendar,
  Compass,
  ArrowRight,
  Star
} from 'lucide-react';
import { addHospitalToCompare, removeHospitalFromCompare } from '../redux/slices/comparisonSlice';
import { formatDistance, estimateTravelTime } from '../services/locationService';
import toast from 'react-hot-toast';

const HospitalCard = ({ hospital }) => {
  const dispatch = useDispatch();
  const { hospitalIds: compareList } = useSelector(state => state.comparison);
  const isCompared = compareList.includes(hospital.id);

  const handleCompareToggle = (e) => {
    e.stopPropagation();
    if (isCompared) {
      dispatch(removeHospitalFromCompare(hospital.id));
      toast.success(`Removed ${hospital.name} from comparison.`);
    } else {
      if (compareList.length >= 4) {
        toast.error('You can compare up to 4 hospitals simultaneously.');
        return;
      }
      dispatch(addHospitalToCompare(hospital.id));
      toast.success(`Added ${hospital.name} to comparison.`);
    }
  };

  const distanceLabel = formatDistance(hospital.distanceKm);
  const travelLabel = estimateTravelTime(hospital.distanceKm);

  return (
    <article className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Top Banner Image with Badges */}
      <div style={{ position: 'relative', height: '185px', overflow: 'hidden', backgroundColor: '#E2E8F0' }}>
        <img
          src={hospital.image || (hospital.images && hospital.images[0])}
          alt={hospital.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          loading="lazy"
        />

        {/* Distance Badge */}
        {distanceLabel && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: 'rgba(15, 45, 72, 0.9)',
              color: '#ffffff',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.76rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}
          >
            <Compass size={13} color="var(--teal)" />
            <span>{distanceLabel}</span>
            {travelLabel && <span style={{ opacity: 0.85, fontSize: '0.7rem' }}>({travelLabel})</span>}
          </div>
        )}

        {/* Emergency Status */}
        {hospital.emergencyServices && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: hospital.emergencyOpen24x7 ? '#10B981' : '#F59E0B',
              color: '#ffffff',
              padding: '0.22rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}
          >
            <Activity size={12} />
            <span>{hospital.emergencyOpen24x7 ? "24/7 Emergency" : "Emergency Care"}</span>
          </div>
        )}

        {/* Subtle Rating Pill on Image Bottom */}
        {hospital.rating && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.76rem',
              fontWeight: '800',
              color: 'var(--primary-dark)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
            }}
          >
            <Star size={12} fill="#F59E0B" color="#F59E0B" />
            <span>{hospital.rating}</span>
            {hospital.reviewCount && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: '500' }}>
                ({hospital.reviewCount.toLocaleString()})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Verification & Type */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--teal)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {hospital.type || "Multi-Specialty Hospital"}
          </span>
          {hospital.verified && (
            <span style={{ fontSize: '0.72rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '700' }} title={`Verified via ${hospital.dataSource}`}>
              <ShieldCheck size={13} />
              <span>Verified Record</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.18rem', color: 'var(--primary-dark)', marginBottom: '0.35rem', lineHeight: '1.28' }}>
          <Link to={`/hospitals/${hospital.id}`} style={{ color: 'inherit' }}>
            {hospital.name}
          </Link>
        </h3>

        {/* Location Text */}
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '0.85rem' }}>
          <MapPin size={13} style={{ flexShrink: 0, color: 'var(--primary)' }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {hospital.address}, {hospital.city}
          </span>
        </p>

        {/* Specialties Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
          {(hospital.specialties || []).slice(0, 3).map((spec, i) => (
            <span
              key={i}
              style={{
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary-dark)',
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              {spec}
            </span>
          ))}
          {(hospital.specialties || []).length > 3 && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center', fontWeight: '700' }}>
              +{(hospital.specialties || []).length - 3} more
            </span>
          )}
        </div>

        {/* Highlights Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.4rem',
            padding: '0.65rem 0.5rem',
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            marginBottom: '1rem',
            textAlign: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Total Beds</div>
            <div style={{ fontWeight: '800', fontSize: '0.88rem', color: 'var(--primary-dark)' }}>{hospital.totalBeds || 'N/A'}</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>ICU Beds</div>
            <div style={{ fontWeight: '800', fontSize: '0.88rem', color: 'var(--teal)' }}>{hospital.icuBeds || 'N/A'}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>OPD Fee</div>
            <div style={{ fontWeight: '800', fontSize: '0.8rem', color: 'var(--primary-dark)' }}>{hospital.consultationFeeRange || 'Standard'}</div>
          </div>
        </div>

        {/* Actions Footer */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/hospitals/${hospital.id}`} className="btn btn-outline-primary btn-sm" style={{ flex: 1 }}>
              <span>View Details</span>
              <ArrowRight size={13} />
            </Link>
            <Link to={`/book-appointment?hospitalId=${hospital.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              <Calendar size={13} />
              <span>Book Slot</span>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.45rem', borderTop: '1px solid var(--border)' }}>
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
                gap: '0.35rem',
                transition: 'all 0.15s ease'
              }}
            >
              {isCompared ? <Check size={12} color="var(--primary)" /> : <Scale size={12} />}
              <span>{isCompared ? "In Compare" : "Compare"}</span>
            </button>

            {hospital.phone && (
              <a
                href={`tel:${hospital.emergencyPhone || hospital.phone}`}
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.76rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontWeight: '600'
                }}
              >
                <PhoneCall size={12} color="var(--teal)" />
                <span>Call Desk</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default HospitalCard;
