import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '../../services/api';
import { validateRequired } from '../../utils/helpers';

const ApplyGatepass = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    reason: '',
    outDateTime: '',
    returnDateTime: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = validateRequired(formData);

    if (formData.outDateTime && formData.returnDateTime) {
      const outDate = new Date(formData.outDateTime);
      const returnDate = new Date(formData.returnDateTime);
      
      if (returnDate <= outDate) {
        newErrors.returnDateTime = 'Return time must be after out time';
      }
      
      const now = new Date();
      if (outDate <= now) {
        newErrors.outDateTime = 'Out time must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');


    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {

      const response = await studentApi.applyGatepass(formData);
      console.log(response)
      setSuccessMessage('Gatepass application submitted successfully!');
      setFormData({
        reason: '',
        outDateTime: '',
        returnDateTime: '',
      });
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      setErrors({submit: error.message})
    } finally {
      setLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">Apply for Gatepass</h1>
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {errors.submit && (
        <div className="alert alert-error">{errors.submit}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Reason *</label>
          <textarea
            name="reason"
            className={`form-control ${errors.reason ? 'error' : ''}`}
            value={formData.reason}
            onChange={handleChange}
            placeholder="Enter reason for gatepass"
            rows="4"
          />
          {errors.reason && (
            <div className="form-error">{errors.reason}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Out Date & Time *</label>
          <input
            type="datetime-local"
            name="outDateTime"
            className={`form-control ${errors.outDateTime ? 'error' : ''}`}
            value={formData.outDateTime}
            onChange={handleChange}
            min={getMinDateTime()}
          />
          {errors.outDateTime && (
            <div className="form-error">{errors.outDateTime}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Return Date & Time *</label>
          <input
            type="datetime-local"
            name="returnDateTime"
            className={`form-control ${errors.returnDateTime ? 'error' : ''}`}
            value={formData.returnDateTime}
            onChange={handleChange}
            min={formData.outDateTime || getMinDateTime()}
          />
          {errors.returnDateTime && (
            <div className="form-error">{errors.returnDateTime}</div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={() => navigate('/student/dashboard')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyGatepass;