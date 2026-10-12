// Currency formatter in INR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

// Date formatter
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

// Unique ID Generator with prefix
export const generateId = (prefix = 'ID') => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${Date.now().toString().slice(-4)}-${random}`;
};

// Status Badge Styling Helper
export const getStatusBadgeClass = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'confirmed':
    case 'successful':
    case 'active':
    case 'available':
    case 'paid':
      return 'badge-success';
    case 'pending':
    case 'in-progress':
      return 'badge-warning';
    case 'cancelled':
    case 'failed':
    case 'inactive':
    case 'unpaid':
      return 'badge-danger';
    case 'completed':
      return 'badge-info';
    default:
      return 'badge-neutral';
  }
};
