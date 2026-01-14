import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { rectorApi } from "../../services/api";
import { isValidEmail, validateRequired } from "../../utils/helpers";

const AddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    phone: "",
    department: "",
    course: "",
    year: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const departments = [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electronics",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Business Administration",
    "Economics",
  ];

  const validateForm = () => {
    const requiredFields = ["name", "email", "rollNumber", "department"];
    const newErrors = validateRequired(
      Object.fromEntries(
        requiredFields.map((field) => [field, formData[field]])
      )
    );

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await rectorApi.addStudent(formData);
      alert(response.autoPassword)
      setSuccessMessage("Student added successfully!");
      setFormData({
        name: "",
        email: "",
        rollNumber: "",
        phone: "",
        department: "",
        course: "",
        year: "",
      });

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      setErrors({ submit: "Failed to add student" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">Add New Student</h1>
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {errors.submit && (
        <div className="alert alert-error">{errors.submit}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? "error" : ""}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter student's full name"
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? "error" : ""}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter student's email"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <div className="form-group">
            <label className="form-label">Roll Number *</label>
            <input
              type="text"
              name="rollNumber"
              className={`form-control ${errors.rollNumber ? "error" : ""}`}
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="Enter roll number"
            />
            {errors.rollNumber && (
              <div className="form-error">{errors.rollNumber}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Department *</label>
            <select
              name="department"
              className={`form-control ${errors.department ? "error" : ""}`}
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <div className="form-error">{errors.department}</div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className={`form-control ${errors.phone ? "error" : ""}`}
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
            {errors.phone && <div className="form-error">{errors.phone}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Course</label>
            <input
              type="text"
              name="course"
              className="form-control"
              value={formData.course}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <div className="form-group">
            <label className="form-label">Year</label>
            <input
              type="tel"
              name="year"
              className={`form-control`}
              value={formData.year}
              onChange={handleChange}
              placeholder="Enter admission year"
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Adding Student..." : "Add Student"}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/rector/dashboard")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
