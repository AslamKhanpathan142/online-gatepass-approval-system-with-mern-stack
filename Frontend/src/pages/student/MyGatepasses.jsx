import React, { useState, useEffect } from 'react';
import { studentApi } from '../../services/api';
import { formatDateTime, getTimeDifference } from '../../utils/helpers';

const MyGatepasses = () => {
  const [gatepasses, setGatepasses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGatepasses();
  }, []);

  const fetchGatepasses = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getGatepasses()
      setGatepasses(response);
    } catch (error) {
      setError('Failed to load gatepasses');
      console.error('Gatepasses error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const filteredGatepasses = gatepasses.filter(gatepass => {
    if (filter === 'all') return true;
    return gatepass.statusGatePass === filter;
  });

  if (loading) {
    return (
      <div className="card">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">My Gatepasses</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('all')}
          >
            All ({gatepasses.length})
          </button>
          <button 
            className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({gatepasses.filter(g => g.statusGatePass === 'pending').length})
          </button>
          <button 
            className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('approved')}
          >
            Approved ({gatepasses.filter(g => g.statusGatePass === 'approved').length})
          </button>
          <button 
            className={`btn ${filter === 'rejected' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected ({gatepasses.filter(g => g.statusGatePass === 'rejected').length})
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {filteredGatepasses.length === 0 ? (
        <div className="alert alert-info">
          No gatepasses found for the selected filter.
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Reason</th>
                <th>Out Time</th>
                <th>Return Time</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Applied On</th>
              </tr>
            </thead>
            <tbody>
              {filteredGatepasses.map((gatepass) => (
                <tr key={gatepass.id}>
                  <td>{gatepass.reason}</td>
                  <td>{formatDateTime(gatepass.outDateTime)}</td>
                  <td>{formatDateTime(gatepass.returnDateTime)}</td>
                  <td>{getTimeDifference(gatepass.outDateTime, gatepass.returnDateTime)}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadge(gatepass.statusGatePass)}`}>
                      {gatepass.statusGatePass}
                    </span>
                  </td>
                  <td>{formatDateTime(gatepass.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyGatepasses;