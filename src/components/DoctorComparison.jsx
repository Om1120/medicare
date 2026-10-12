import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Scale, 
  Trash2, 
  Calendar, 
  Star, 
  X, 
  Building2, 
  Clock, 
  Globe, 
  Check, 
  CheckCircle2, 
  Stethoscope, 
  GraduationCap,
  Languages,
  Layers,
  Search,
  User,
  Plus
} from 'lucide-react';
import { 
  addDoctorToCompare, 
  removeDoctorFromCompare, 
  clearDoctorComparison 
} from '../redux/slices/comparisonSlice';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

const DoctorComparison = ({ doctors = [], allDoctors = [] }) => {
  const dispatch = useDispatch();
  const { doctorIds } = useSelector(state => state.comparison);
  
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [doctorSearchInput, setDoctorSearchInput] = useState('');
  const [appliedDoctorSearch, setAppliedDoctorSearch] = useState('');

  // Compute unique departments
  const departments = Array.from(new Set(allDoctors.map(d => d.department).filter(Boolean)));

  const visibleTrayDoctors = allDoctors.filter(d => {
    const matchesDept = selectedDept === 'ALL' || d.department.toLowerCase() === selectedDept.toLowerCase();
    if (!matchesDept) return false;
    if (appliedDoctorSearch.trim()) {
      const q = appliedDoctorSearch.toLowerCase().trim();
      return (
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        (d.hospitalName || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const displayedComparedDoctors = doctors.filter(d => {
    if (!appliedDoctorSearch.trim()) return true;
    const q = appliedDoctorSearch.toLowerCase().trim();
    return (
      d.name.toLowerCase().includes(q) ||
      d.specialization.toLowerCase().includes(q) ||
      (d.hospitalName || '').toLowerCase().includes(q)
    );
  });

  const finalComparedDoctors = displayedComparedDoctors.length > 0 ? displayedComparedDoctors : doctors;

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setAppliedDoctorSearch(doctorSearchInput.trim());
    if (doctorSearchInput.trim()) {
      toast.success(`Showing doctors matching "${doctorSearchInput.trim()}"`);
    }
  };

  const handleClearSearch = () => {
    setDoctorSearchInput('');
    setAppliedDoctorSearch('');
  };

  const handleToggleDoctor = (doctorId) => {
    if (doctorIds.includes(doctorId)) {
      dispatch(removeDoctorFromCompare(doctorId));
      toast.success('Removed doctor from comparison.');
    } else {
      dispatch(addDoctorToCompare(doctorId));
      toast.success('Doctor selected for comparison.');
    }
  };

  const handleSelectAllDoctors = () => {
    allDoctors.forEach(d => {
      if (!doctorIds.includes(d.id)) {
        dispatch(addDoctorToCompare(d.id));
      }
    });
    toast.success(`Selected all ${allDoctors.length} doctors.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. ALL DOCTORS QUICK SELECTOR & SEARCH TRAY */}
      <div
        className="card"
        style={{
          padding: '1.5rem',
          backgroundColor: '#ffffff',
          border: '1px solid var(--border)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--teal)', fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Layers size={15} />
              <span>Specialist Selection Hub</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', margin: '0.2rem 0' }}>
              Select Doctors to View Details ({doctors.length} selected of {allDoctors.length})
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
              Click any doctor card below to select them and view their full clinical credentials, OPD fees, and availability.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleSelectAllDoctors}
              className="btn btn-outline-primary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              <CheckCircle2 size={13} />
              <span>Select All ({allDoctors.length})</span>
            </button>
            {doctorIds.length > 0 && (
              <button
                type="button"
                onClick={() => dispatch(clearDoctorComparison())}
                className="btn btn-outline-secondary btn-sm"
                style={{ fontSize: '0.78rem', color: 'var(--danger)' }}
              >
                <Trash2 size={13} />
                <span>Clear Selection</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar with dedicated Search Button */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search
              size={17}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Search doctors by name, specialty, or affiliated hospital..."
              value={doctorSearchInput}
              onChange={(e) => setDoctorSearchInput(e.target.value)}
              style={{ paddingLeft: '2.4rem', height: '40px', fontSize: '0.88rem' }}
            />
            {doctorSearchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-sm"
            style={{ height: '40px', padding: '0 1.25rem', gap: '0.4rem', fontWeight: '700' }}
          >
            <Search size={15} />
            <span>Search</span>
          </button>

          {appliedDoctorSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="btn btn-outline-secondary btn-sm"
              style={{ height: '40px' }}
            >
              <span>Clear Search</span>
            </button>
          )}
        </form>

        {/* Department Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '0.85rem' }}>
          <button
            type="button"
            onClick={() => setSelectedDept('ALL')}
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.76rem',
              fontWeight: selectedDept === 'ALL' ? '700' : '600',
              border: selectedDept === 'ALL' ? '1.5px solid var(--primary)' : '1px solid var(--border)',
              backgroundColor: selectedDept === 'ALL' ? 'var(--primary)' : '#ffffff',
              color: selectedDept === 'ALL' ? '#ffffff' : 'var(--text-body)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            All Specialties ({allDoctors.length})
          </button>
          {departments.map(dept => {
            const count = allDoctors.filter(d => d.department === dept).length;
            const isSelected = selectedDept.toLowerCase() === dept.toLowerCase();
            return (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.76rem',
                  fontWeight: isSelected ? '700' : '600',
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                  backgroundColor: isSelected ? 'var(--primary)' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--text-body)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {dept} ({count})
              </button>
            );
          })}
        </div>

        {/* Doctor Selector Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '0.65rem',
            maxHeight: '220px',
            overflowY: 'auto',
            padding: '0.35rem 0'
          }}
        >
          {visibleTrayDoctors.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
              No doctors match "{appliedDoctorSearch}". Try a different keyword or specialty.
            </div>
          ) : (
            visibleTrayDoctors.map(d => {
              const isSelected = doctorIds.includes(d.id);
              return (
                <div
                  key={d.id}
                  onClick={() => handleToggleDoctor(d.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: isSelected ? '#EAF6FB' : '#F8FAFC',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      backgroundColor: isSelected ? 'var(--primary)' : '#ffffff',
                      border: isSelected ? 'none' : '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      flexShrink: 0
                    }}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>

                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {d.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {d.department} • {formatCurrency(d.fee)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. IF NO DOCTOR SELECTED -> EMPTY STATE */}
      {finalComparedDoctors.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            border: '2px dashed var(--border)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#EAF6FB',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <User size={32} />
          </div>

          <div style={{ maxWidth: '520px' }}>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-dark)', fontWeight: '800', marginBottom: '0.4rem' }}>
              No Doctor Selected Yet
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
              Please select one or more doctors from the list above to display and compare their detailed profiles, qualifications, hospital affiliations, consultation fees, and available hours.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={handleSelectAllDoctors}
              className="btn btn-primary btn-sm"
              style={{ fontWeight: '700' }}
            >
              <Plus size={15} />
              <span>Select All Doctors ({allDoctors.length})</span>
            </button>
          </div>
        </div>
      ) : (
        /* 3. STRUCTURED SIDE-BY-SIDE DOCTORS TABLE */
        <div className="table-responsive" style={{ boxShadow: 'var(--shadow-md)', backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
          <table className="table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ width: '200px', backgroundColor: '#F1F5F9', position: 'sticky', left: 0, zIndex: 10 }}>
                  <span style={{ fontSize: '0.88rem', color: 'var(--primary-dark)', fontWeight: '800' }}>Doctor Attributes</span>
                </th>
                {finalComparedDoctors.map(doc => (
                  <th key={doc.id} style={{ minWidth: '240px', textAlign: 'left', backgroundColor: '#ffffff', borderLeft: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--teal)', fontWeight: '800', textTransform: 'uppercase' }}>
                        {doc.department}
                      </span>
                      <button
                        type="button"
                        onClick={() => dispatch(removeDoctorFromCompare(doc.id))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        title="Remove from comparison"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <img
                        src={doc.image}
                        alt={doc.name}
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-light)' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '1rem', color: 'var(--primary-dark)', margin: 0, fontWeight: '800' }}>
                          <Link to={`/doctors/${doc.id}`} style={{ color: 'inherit' }}>
                            {doc.name}
                          </Link>
                        </h4>
                        <div style={{ fontSize: '0.78rem', color: 'var(--teal)', fontWeight: '700' }}>
                          {doc.specialization}
                        </div>
                      </div>
                    </div>

                    <Link to={`/book-appointment?doctorId=${doc.id}`} className="btn btn-primary btn-sm" style={{ width: '100%', fontSize: '0.78rem' }}>
                      <Calendar size={13} />
                      <span>Book Consultation</span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Affiliated Hospital</td>
                {finalComparedDoctors.map(doc => (
                  <td key={doc.id} style={{ borderLeft: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600', color: 'var(--primary-dark)', fontSize: '0.84rem' }}>
                      <Building2 size={15} color="var(--primary)" />
                      <span>{doc.hospitalName}</span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Consultation Fee</td>
                {finalComparedDoctors.map(doc => (
                  <td key={doc.id} style={{ borderLeft: '1px solid var(--border)' }}>
                    <strong style={{ fontSize: '1rem', color: 'var(--primary)' }}>
                      {formatCurrency(doc.fee)}
                    </strong>
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Clinical Experience</td>
                {finalComparedDoctors.map(doc => (
                  <td key={doc.id} style={{ borderLeft: '1px solid var(--border)', fontSize: '0.84rem' }}>
                    <strong>{doc.experience}</strong> of clinical practice
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Qualifications</td>
                {finalComparedDoctors.map(doc => (
                  <td key={doc.id} style={{ borderLeft: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {doc.qualification}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Available OPD Hours</td>
                {finalComparedDoctors.map(doc => (
                  <td key={doc.id} style={{ borderLeft: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.82rem' }}>
                      <div style={{ fontWeight: '600', color: 'var(--primary-dark)' }}>{doc.availableTime}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>{(doc.availableDays || []).join(', ')}</div>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Languages Spoken</td>
                {finalComparedDoctors.map(doc => (
                  <td key={doc.id} style={{ borderLeft: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {(doc.languages || []).map((lang, idx) => (
                        <span key={idx} style={{ fontSize: '0.72rem', backgroundColor: '#F1F5F9', padding: '0.15rem 0.45rem', borderRadius: '3px' }}>
                          {lang}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Patient Rating</td>
                {finalComparedDoctors.map(doc => (
                  <td key={doc.id} style={{ borderLeft: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Star size={15} fill="#f59e0b" color="#f59e0b" />
                      <strong style={{ color: 'var(--text-dark)' }}>{doc.rating}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({doc.reviewCount} verified reviews)</span>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default DoctorComparison;
