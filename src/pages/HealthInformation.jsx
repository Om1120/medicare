import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  Pill, 
  BookOpen, 
  Wind, 
  Sun, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Thermometer, 
  RefreshCw,
  Info
} from 'lucide-react';
import healthTips from '../data/healthTips.json';
import { medicineService } from '../services/medicineService';
import { medicalResearchService } from '../services/medicalResearchService';
import { weatherHealthService } from '../services/weatherHealthService';

const HealthInformation = () => {
  const [activeTab, setActiveTab] = useState('tips'); // 'tips' | 'drugs' | 'research' | 'aqi'
  const [activeCategory, setActiveCategory] = useState('ALL');

  // OpenFDA Drugs State
  const [drugQuery, setDrugQuery] = useState('');
  const [drugsList, setDrugsList] = useState([]);
  const [loadingDrugs, setLoadingDrugs] = useState(false);

  // PubMed Research State
  const [researchQuery, setResearchQuery] = useState('Cardiology');
  const [researchPapers, setResearchPapers] = useState([]);
  const [loadingResearch, setLoadingResearch] = useState(false);

  // Air Quality & Environmental State
  const [aqiData, setAqiData] = useState(null);
  const [loadingAqi, setLoadingAqi] = useState(false);

  const categories = ['ALL', 'Healthy Lifestyle', 'Nutrition', 'Exercise', 'Preventive Care', 'Common Health Tips', 'When to Consult a Doctor'];

  const filteredTips = activeCategory === 'ALL'
    ? healthTips
    : healthTips.filter(tip => tip.category === activeCategory);

  // Initial loads for APIs
  useEffect(() => {
    // Load initial drugs
    setDrugsList(medicineService.getPopularDrugs());

    // Load initial research
    fetchResearch('Cardiology');

    // Load live AQI
    fetchAqi();
  }, []);

  const fetchAqi = async () => {
    setLoadingAqi(true);
    try {
      const data = await weatherHealthService.getLiveHealthAtmosphere(19.0760, 72.8777);
      setAqiData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAqi(false);
    }
  };

  const handleDrugSearch = async (e) => {
    if (e) e.preventDefault();
    setLoadingDrugs(true);
    try {
      const res = await medicineService.searchDrugs(drugQuery);
      setDrugsList(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDrugs(false);
    }
  };

  const fetchResearch = async (term) => {
    setLoadingResearch(true);
    try {
      const papers = await medicalResearchService.searchPubMed(term);
      setResearchPapers(papers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingResearch(false);
    }
  };

  return (
    <div className="health-info-page" style={{ padding: '3.5rem 0', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '2rem' }}>
          <span className="section-subtitle">Clinical Intelligence & Patient Education</span>
          <h1 className="section-title">Health Information, Drugs & Medical Research</h1>
          <p className="section-description">
            Evidence-based wellness guides, live OpenFDA pharmaceutical monographs, real-time PubMed clinical trials, and environmental health advisories.
          </p>
        </div>

        {/* Live Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            borderBottom: '2px solid var(--border)',
            paddingBottom: '0.75rem',
            marginBottom: '2.5rem',
            overflowX: 'auto'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('tips')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: activeTab === 'tips' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'tips' ? '#ffffff' : 'var(--text-dark)',
              fontWeight: '700',
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all var(--transition-fast)'
            }}
          >
            <BookOpen size={18} />
            <span>Wellness & Clinical Guides</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('drugs')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: activeTab === 'drugs' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'drugs' ? '#ffffff' : 'var(--text-dark)',
              fontWeight: '700',
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Pill size={18} />
            <span>OpenFDA Medicine Directory</span>
            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', backgroundColor: activeTab === 'drugs' ? 'rgba(255,255,255,0.25)' : 'var(--teal-light)', color: activeTab === 'drugs' ? '#fff' : 'var(--teal)', borderRadius: '10px' }}>LIVE API</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('research')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: activeTab === 'research' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'research' ? '#ffffff' : 'var(--text-dark)',
              fontWeight: '700',
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Sparkles size={18} />
            <span>PubMed Medical Studies</span>
            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', backgroundColor: activeTab === 'research' ? 'rgba(255,255,255,0.25)' : 'var(--teal-light)', color: activeTab === 'research' ? '#fff' : 'var(--teal)', borderRadius: '10px' }}>NCBI API</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('aqi')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: activeTab === 'aqi' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'aqi' ? '#ffffff' : 'var(--text-dark)',
              fontWeight: '700',
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Wind size={18} />
            <span>Live Air Quality & Health Risk</span>
            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', backgroundColor: activeTab === 'aqi' ? 'rgba(255,255,255,0.25)' : '#DCFCE7', color: activeTab === 'aqi' ? '#fff' : '#166534', borderRadius: '10px' }}>Open-Meteo</span>
          </button>
        </div>

        {/* TAB 1: WELLNESS GUIDES */}
        {activeTab === 'tips' && (
          <div>
            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
              {categories.map(cat => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-full)',
                      border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: isActive ? 'var(--primary)' : '#ffffff',
                      color: isActive ? '#ffffff' : 'var(--text-body)',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {cat === 'ALL' ? 'All Health Topics' : cat}
                  </button>
                );
              })}
            </div>

            {/* Health Guides Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
              {filteredTips.map((tip) => (
                <div key={tip.id} className="card card-interactive" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="badge badge-info" style={{ textTransform: 'uppercase', fontSize: '0.72rem' }}>
                      {tip.category}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      <Clock size={14} />
                      <span>{tip.readTime}</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '0.65rem', lineHeight: '1.3' }}>
                    {tip.title}
                  </h3>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.55', marginBottom: '1.25rem' }}>
                    {tip.summary}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <strong style={{ fontSize: '0.82rem', color: 'var(--text-dark)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                      Key Clinical Recommendations:
                    </strong>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', padding: 0 }}>
                      {tip.keyPoints.map((point, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--text-body)' }}>
                          <CheckCircle2 size={15} color="var(--teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: OPENFDA MEDICINE DIRECTORY */}
        {activeTab === 'drugs' && (
          <div>
            {/* Search Bar */}
            <form onSubmit={handleDrugSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', maxWidth: '640px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search real FDA medicines (e.g. Paracetamol, Metformin, Atorvastatin, Amoxicillin)..."
                  value={drugQuery}
                  onChange={(e) => setDrugQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loadingDrugs}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
              >
                {loadingDrugs ? <RefreshCw size={16} className="spin" /> : <Search size={16} />}
                <span>Search OpenFDA</span>
              </button>
            </form>

            {/* Drugs List Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {drugsList.map((drug) => (
                <div key={drug.id} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', margin: 0 }}>
                        {drug.brandName}
                      </h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--teal)', fontWeight: '600' }}>
                        {drug.genericName}
                      </span>
                    </div>
                    <span className={`badge ${drug.prescriptionRequired ? 'badge-warning' : 'badge-success'}`}>
                      {drug.prescriptionRequired ? 'Rx Required' : 'OTC Available'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                    Category: <strong>{drug.category}</strong>
                  </div>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <strong style={{ fontSize: '0.82rem', color: 'var(--text-dark)', display: 'block', marginBottom: '0.2rem' }}>
                      Clinical Indication:
                    </strong>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', margin: 0, lineHeight: '1.45' }}>
                      {drug.indication}
                    </p>
                  </div>

                  <div style={{ marginBottom: '0.85rem', backgroundColor: 'var(--bg-main)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--primary-dark)', display: 'block', marginBottom: '0.2rem' }}>
                      Standard Dosage & Administration:
                    </strong>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', margin: 0 }}>
                      {drug.dosage}
                    </p>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', fontSize: '0.78rem', color: '#B45309', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertCircle size={14} style={{ flexShrink: 0 }} />
                    <span>Always take medications under registered physician supervision.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PUBMED NCBI RESEARCH */}
        {activeTab === 'research' && (
          <div>
            {/* Search / Topics Bar */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {['Cardiology', 'Neurology', 'Orthopedics', 'Diabetes', 'Oncology', 'Immunology', 'Pediatrics'].map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => {
                    setResearchQuery(topic);
                    fetchResearch(topic);
                  }}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${researchQuery === topic ? 'var(--primary)' : 'var(--border)'}`,
                    backgroundColor: researchQuery === topic ? 'var(--primary-light)' : '#ffffff',
                    color: researchQuery === topic ? 'var(--primary-dark)' : 'var(--text-body)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {topic} Studies
                </button>
              ))}
            </div>

            {loadingResearch ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <RefreshCw size={24} className="spin" style={{ margin: '0 auto 1rem' }} />
                <p>Querying NCBI PubMed Entrez E-Utilities API for clinical literature...</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {researchPapers.map((paper) => (
                  <div key={paper.uid} className="card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span className="badge badge-info">PubMed ID: {paper.uid}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Published: {paper.pubDate}</span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '0.4rem', lineHeight: '1.35' }}>
                      {paper.title}
                    </h3>

                    <p style={{ fontSize: '0.82rem', color: 'var(--teal)', fontWeight: '600', marginBottom: '0.75rem' }}>
                      Authors: {paper.authors} • <em>{paper.source}</em>
                    </p>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: '1.5', marginBottom: '1rem' }}>
                      {paper.summary}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>DOI: {paper.doi}</span>
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
                      >
                        <span>View on PubMed</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: LIVE AQI & WEATHER ADVISORY */}
        {activeTab === 'aqi' && aqiData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* AQI Overview Card */}
            <div
              className="card"
              style={{
                padding: '2.5rem',
                borderLeft: `8px solid ${aqiData.color}`,
                backgroundColor: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
                    Live Atmospheric & Health Risk Index (Open-Meteo API)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '3.5rem', fontWeight: '800', color: aqiData.color, lineHeight: 1 }}>
                      {aqiData.aqi}
                    </span>
                    <div>
                      <span className={`badge ${aqiData.badgeClass}`} style={{ fontSize: '0.9rem', padding: '0.35rem 0.75rem' }}>
                        {aqiData.category}
                      </span>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Last Updated: {aqiData.timestamp}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', textAlign: 'center' }}>
                  <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>PM 2.5</span>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--primary-dark)' }}>{aqiData.pm25} µg/m³</strong>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>UV Index</span>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--primary-dark)' }}>{aqiData.uvIndex}</strong>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Temperature</span>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--primary-dark)' }}>{aqiData.temperature}°C</strong>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                <strong style={{ fontSize: '0.92rem', color: 'var(--primary-dark)', display: 'block', marginBottom: '0.4rem' }}>
                  Clinical Health Advisory for High-Risk Groups:
                </strong>
                <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
                  {aqiData.advisory} {aqiData.uvAdvisory}
                </p>
              </div>
            </div>

            {/* Targeted Health Advisories */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <h4 style={{ color: 'var(--primary-dark)', fontSize: '1.05rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Heart size={18} color="var(--primary)" />
                  <span>Cardiovascular Patients</span>
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: 0 }}>
                  Elevated PM2.5 can induce vascular inflammation. Hypertensive and CAD patients should avoid vigorous early morning outdoor exercise when particulate concentrations peak.
                </p>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <h4 style={{ color: 'var(--primary-dark)', fontSize: '1.05rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Wind size={18} color="var(--teal)" />
                  <span>Asthma & Respiratory Care</span>
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: 0 }}>
                  Carry rescue bronchodilators at all times. Use HEPA indoor air filtration and keep windows sealed during peak traffic and smog hours.
                </p>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <h4 style={{ color: 'var(--primary-dark)', fontSize: '1.05rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sun size={18} color="#F59E0B" />
                  <span>Dermatology & UV Shield</span>
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: 0 }}>
                  Current UV radiation requires broad-spectrum SPF 50 sunscreen application 20 minutes prior to outdoor daylight exposure.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FAQs */}
        <div style={{ marginTop: '4.5rem', backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <HelpCircle size={28} color="var(--primary)" />
            <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-dark)', margin: 0 }}>
              Frequently Asked Patient Questions
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-dark)', marginBottom: '0.4rem' }}>
                How should I prepare for fasting blood tests?
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: '1.5' }}>
                For lipid profiles and fasting blood glucose, fast for 8–10 hours overnight. Water is permitted, but avoid tea, coffee, and sugary beverages.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-dark)', marginBottom: '0.4rem' }}>
                When should I visit the Emergency Department?
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: '1.5' }}>
                Severe chest pressure, facial drooping, acute shortness of breath, heavy uncontrolled bleeding, or sudden paralysis require immediate Level-1 emergency attention.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HealthInformation;
