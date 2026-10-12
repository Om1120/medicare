import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import SearchBar from './SearchBar';

const DataTable = ({
  columns,
  data = [],
  searchKey = 'name',
  searchPlaceholder = 'Search records...',
  filterOptions = null,
  filterKey = 'status',
  filterPlaceholder = 'All Statuses',
  itemsPerPage = 8,
  actions = null,
  emptyMessage = 'No records found matching your criteria.'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered & Searched Data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search matching
      let matchesSearch = true;
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        if (Array.isArray(searchKey)) {
          matchesSearch = searchKey.some(key => {
            const val = item[key];
            return val && String(val).toLowerCase().includes(term);
          });
        } else {
          const val = item[searchKey];
          matchesSearch = val && String(val).toLowerCase().includes(term);
        }
      }

      // Filter matching
      let matchesFilter = true;
      if (selectedFilter !== 'ALL' && filterKey) {
        matchesFilter = item[filterKey] === selectedFilter;
      }

      return matchesSearch && matchesFilter;
    });
  }, [data, searchTerm, searchKey, selectedFilter, filterKey]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const currentRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Controls Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', flex: 1, minWidth: '280px' }}>
          <SearchBar
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            maxWidth="320px"
          />

          {filterOptions && (
            <select
              className="form-select"
              value={selectedFilter}
              onChange={(e) => {
                setSelectedFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ maxWidth: '200px' }}
            >
              <option value="ALL">{filterPlaceholder}</option>
              {filterOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}
        </div>

        {actions && (
          <div>
            {actions}
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={{ textAlign: col.align || 'left', width: col.width || 'auto' }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((row, rowIdx) => (
                <tr key={row.id || rowIdx}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} style={{ textAlign: col.align || 'left' }}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <Inbox size={36} color="var(--teal)" />
                    <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filteredData.length > itemsPerPage && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} records
          </div>
          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              style={{ padding: '0.3rem 0.6rem' }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ padding: '0 0.5rem', fontWeight: '600', color: 'var(--text-dark)' }}>
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              style={{ padding: '0.3rem 0.6rem' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
