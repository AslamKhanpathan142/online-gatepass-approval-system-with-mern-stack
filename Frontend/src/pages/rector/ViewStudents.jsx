import React, { useState, useEffect } from "react";
import { rectorApi } from "../../services/api";

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, departmentFilter]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await rectorApi.getStudents();

      setStudents(studentsData);
      const uniqueDepts = [...new Set(studentsData.map((s) => s.department))];
      setDepartments(uniqueDepts);
    } catch (error) {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(term) ||
          student.email.toLowerCase().includes(term) ||
          student.rollNumber.toLowerCase().includes(term) ||
          student.department.toLowerCase().includes(term)
      );
    }
    if (departmentFilter !== "all") {
      filtered = filtered.filter(
        (student) => student.department === departmentFilter
      );
    }

    setFilteredStudents(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">View Students</h1>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span>Total: {students.length} students</span>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1", minWidth: "250px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ width: "200px" }}>
          <select
            className="form-control"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="alert alert-info">
          No students found matching your criteria.
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Course</th>
                <th>Phone</th>
                <th>Year</th>
                <th>Joined On</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.rollNumber}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.department}</td>
                  <td>{student.course}</td>
                  <td>{student.phone}</td>
                  <td>{student.year}</td>
                  <td>{formatDate(student.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewStudents;
