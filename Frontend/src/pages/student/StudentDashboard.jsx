import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { studentApi } from "../../services/api";

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [recentGatepasses, setRecentGatepasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Mock data - replace with actual API call
      const dataGatepasses = await studentApi.getGatepasses();

      const total = dataGatepasses.length;
      const pending = dataGatepasses.filter(
        (g) => g.statusGatePass === "pending"
      ).length;
      const approved = dataGatepasses.filter(
        (g) => g.statusGatePass === "approved"
      ).length;
      const rejected = dataGatepasses.filter(
        (g) => g.statusGatePass === "rejected"
      ).length;

      setStats({ total, pending, approved, rejected });
      setRecentGatepasses(dataGatepasses.slice(0, 3));
    } catch (error) {
      setError("Failed to load dashboard data");
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
        <h1 className="card-title">Student Dashboard</h1>
        <Link to="/student/apply-gatepass" className="btn btn-primary">
          Apply New Gatepass
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Gatepasses</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{stats.pending}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Approved</div>
          <div className="stat-value">{stats.approved}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rejected</div>
          <div className="stat-value">{stats.rejected}</div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Recent Gatepasses</h2>
        {recentGatepasses.length === 0 ? (
          <p>No gatepass applications yet.</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Reason</th>
                  <th>Out Date & Time</th>
                  <th>Return Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentGatepasses.map((gatepass) => (
                  <tr key={gatepass.id}>
                    <td>{gatepass.reason}</td>
                    <td>{formatDate(gatepass.outDateTime)}</td>
                    <td>{formatDate(gatepass.returnDateTime)}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusBadge(
                          gatepass.statusGatePass
                        )}`}
                      >
                        {gatepass.statusGatePass}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop: "1rem", textAlign: "right" }}>
          <Link to="/student/my-gatepasses" className="btn btn-outline">
            View All Gatepasses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
