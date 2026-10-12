import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Stethoscope, Filter, Inbox } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import SearchBar from '../components/SearchBar';

const Services = () => {
  const { services } = useSelector(state => state.services);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = useMemo(() => {
    const set = new Set();
    services.forEach(s => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'ALL' ||
        service.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [services, searchTerm, selectedCategory]);

  return (
    <div className="services-page" style={{ padding: '3.5rem 0' }}>
      <div className="container">
        
        {/* Page Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <span className="section-subtitle">Clinical Diagnostics & Packages</span>
          <h1 className="section-title">Hospital Services</h1>
          <p className="section-description">
            Transparent pricing, swift laboratory turnaround, and specialized care packages for you and your family.
          </p>
        </div>

        {/* Filter / Search Bar */}
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
              placeholder="Search services (e.g. MRI, Blood Test, Health Check)..."
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <Filter size={16} />
              <span>Category:</span>
            </div>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: 'auto', minWidth: '180px' }}
            >
              <option value="ALL">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
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
              No Services Found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              No clinical services matched your search term "{searchTerm}".
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Services;
