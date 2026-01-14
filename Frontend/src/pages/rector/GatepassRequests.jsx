import React, { useState, useEffect } from "react";
import { rectorApi } from "../../services/api";
import { formatDateTime, getTimeDifference } from "../../utils/helpers";

const GatepassRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const studentsGatepassRequests = await rectorApi.getGatepassRequests();
      setRequests(studentsGatepassRequests);
    } catch (error) {
      setError("Failed to load gatepass requests");
      console.error("Requests error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      const response = await rectorApi.updateGatepassStatus(requestId, status);
      alert(response.message);
      setRequests((prevGatepasses) =>
        prevGatepasses.map((gp) =>
          gp._id === requestId ? { ...gp, statusGatePass: status } : gp
        )
      );
    } catch (error) {
      console.error("Update status error:", error);
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

  const filteredRequests = requests.filter(
    (req) => req.statusGatePass === filter
  );

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
        <h1 className="card-title">Gatepass Requests</h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className={`btn ${
              filter === "pending" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`btn ${
              filter === "approved" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setFilter("approved")}
          >
            Approved
          </button>
          <button
            className={`btn ${
              filter === "rejected" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setFilter("rejected")}
          >
            Rejected
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {filteredRequests.length === 0 ? (
        <div className="alert alert-info">
          No {filter} gatepass requests found.
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Department</th>
                <th>Reason</th>
                <th>Out Time</th>
                <th>Return Time</th>
                <th>Duration</th>
                <th>Status</th>
                {filter === "pending" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.studentId.name}</td>
                  <td>{request.studentId.rollNumber}</td>
                  <td>{request.studentId.department}</td>
                  <td>{request.reason}</td>
                  <td>{formatDateTime(request.outDateTime)}</td>
                  <td>{formatDateTime(request.returnDateTime)}</td>
                  <td>
                    {getTimeDifference(
                      request.outDateTime,
                      request.returnDateTime
                    )}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${getStatusBadge(
                        request.statusGatePass
                      )}`}
                    >
                      {request.statusGatePass}
                    </span>
                  </td>

                  {filter === "pending" && (
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          className="btn btn-success"
                          onClick={() =>
                            handleStatusUpdate(request._id, "approved")
                          }
                          style={{
                            padding: "0.25rem 0.5rem",
                            fontSize: "0.875rem",
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleStatusUpdate(request._id, "rejected")
                          }
                          style={{
                            padding: "0.25rem 0.5rem",
                            fontSize: "0.875rem",
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GatepassRequests;
