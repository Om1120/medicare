import React from 'react';
import { SearchX, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = SearchX,
  title = "No results found",
  description = "Try adjusting your search query, expanding the radius, or clearing applied filters.",
  actionText,
  actionLink,
  onActionClick
}) => {
  return (
    <div
      className="card"
      style={{
        padding: '3.5rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '1.5rem 0',
        backgroundColor: '#ffffff'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem'
        }}
      >
        <Icon size={32} />
      </div>

      <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '480px', marginBottom: (actionText || actionLink) ? '1.5rem' : 0 }}>
        {description}
      </p>

      {actionLink && (
        <Link to={actionLink} className="btn btn-primary btn-sm">
          <span>{actionText || "Explore Directory"}</span>
          <ArrowRight size={16} />
        </Link>
      )}

      {onActionClick && !actionLink && (
        <button type="button" onClick={onActionClick} className="btn btn-outline-primary btn-sm">
          <span>{actionText || "Reset Filters"}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
