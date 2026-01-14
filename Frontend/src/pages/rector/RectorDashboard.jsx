import React, { useState, useEffect } from 'react';
import { rectorApi } from '../../services/api';
import { Link } from 'react-router-dom';

const RectorDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalGatepasses: 0,
    pendingRequests: 0,
    approvedToday: 0,
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const studentsGatepassRequests = await rectorApi.getGatepassRequests()
      const pandingData = studentsGatepassRequests.filter(pd => pd.statusGatePass == 'pending')
      const approvedData = studentsGatepassRequests.filter(pd => pd.statusGatePass == 'approved')
      const studentsData = await rectorApi.getStudents();
      const mockStats = {
        totalStudents: studentsData.length,
        totalGatepasses: studentsGatepassRequests.length,
        pendingRequests: pandingData.length,
        approvedToday: approvedData.length,
      };
      setStats(mockStats);
      setPendingRequests(pandingData);
    } catch (error) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

   const handleStatusUpdate = async (requestId, status) => {
      try {
        const response = await rectorApi.updateGatepassStatus(requestId, status);
        alert(response.message);
        setPendingRequests((prevGatepasses) =>
          prevGatepasses.map((gp) =>
            gp._id === requestId ? { ...gp, statusGatePass: status } : gp
          )
        );
      } catch (error) {
        console.error("Update status error:", error);
      }
    };

    const filteredRequests = pendingRequests.filter(
    (req) => req.statusGatePass === filter
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="card">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="card-header">
        <h1 className="card-title">Rector Dashboard</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{stats.totalStudents}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Gatepasses</div>
          <div className="stat-value">{stats.totalGatepasses}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Requests</div>
          <div className="stat-value">{stats.pendingRequests}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Approved</div>
          <div className="stat-value">{stats.approvedToday}</div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Pending Gatepass Requests</h2>
        {pendingRequests.length === 0 ? (
          <p>No pending gatepass requests.</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll Number</th>
                  <th>Reason</th>
                  <th>Out Time</th>
                  <th>Return Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.studentId.name}</td>
                    <td>{request.studentId.rollNumber}</td>
                    <td>{request.reason}</td>
                    <td>{formatDate(request.outDateTime)}</td>
                    <td>{formatDate(request.returnDateTime)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-success"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                          onClick={() =>
                            handleStatusUpdate(request._id, "approved")
                          }
                        >
                          Approve
                        </button>
                        <button 
                          className="btn btn-danger"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                           onClick={() =>
                            handleStatusUpdate(request._id, "rejected")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <Link to='/rector/gatepass-requests' className="btn btn-primary">
            View All Requests
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RectorDashboard;