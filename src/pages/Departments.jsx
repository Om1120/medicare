import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Building2, Search, Filter, Inbox } from 'lucide-react';
import DepartmentCard from '../components/DepartmentCard';
import SearchBar from '../components/SearchBar';

const Departments = () => {
  const { departments } = useSelector(state => state.departments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ALL');

  // Locations for filter
  const locations = useMemo(() => {
    const locSet = new Set();
    departments.forEach(d => {
      if (d.location) {
        const building = d.location.split(',')[0];
        locSet.add(building.trim());
      }
    });
    return Array.from(locSet);
  }, [departments]);

  // Filtered departments
  const filteredDepartments = useMemo(() => {
    return departments.filter(dept => {
      const matchesSearch =
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dept.headDoctor && dept.headDoctor.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesLocation =
        selectedLocation === 'ALL' ||
        (dept.location && dept.location.toLowerCase().includes(selectedLocation.toLowerCase()));

      return matchesSearch && matchesLocation;
    });
  }, [departments, searchTerm, selectedLocation]);

  return (
    <div className="departments-page" style={{ padding: '3.5rem 0' }}>
      <div className="container">
        
        {/* Page Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <span className="section-subtitle">Clinical Specialties</span>
          <h1 className="section-title">Medical Departments</h1>
          <p className="section-description">
            Discover our comprehensive array of medical centers, staffed with certified consultants and modern diagnostics.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2.5rem'
          }}
        >
          <div style={{ flex: '1', minWidth: '280px', maxWidth: '450px' }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search departments (e.g. Cardiology, Orthopedics)..."
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <Filter size={16} />
              <span>Wing:</span>
            </div>
            <select
              className="form-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{ width: 'auto', minWidth: '160px' }}
            >
              <option value="ALL">All Buildings</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Departments Grid */}
        {filteredDepartments.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
            {filteredDepartments.map(dept => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '4rem 1.5rem',
              textAlign: 'center'
            }}
          >
            <Inbox size={48} color="var(--teal)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', marginBottom: '0.4rem' }}>
              No Departments Found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              No medical departments matched "{searchTerm}". Try adjusting your keywords.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Departments;
