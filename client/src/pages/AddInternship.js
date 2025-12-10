import React, { useState } from 'react';
import axios from 'axios';
import './AddInternship.css';

function AddInternship() {
  const [formData, setFormData] = useState({
    companyName: '',
    position: '',
    duration: '',
    stipend: '',
    location: '',
    description: '',
    requirements: '',
    applicationDeadline: '',
    startDate: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/api/internships', {
        ...formData,
        stipend: parseFloat(formData.stipend)
      });

      if (response.status === 201) {
        setMessage('Internship added successfully!');
        setFormData({
          companyName: '',
          position: '',
          duration: '',
          stipend: '',
          location: '',
          description: '',
          requirements: '',
          applicationDeadline: '',
          startDate: ''
        });
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setError('Error adding internship. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-internship">
      <h1>Add New Internship</h1>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="companyName">Company Name *</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            placeholder="Enter company name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="position">Position *</label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            placeholder="Enter position (e.g., Software Engineer)"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="duration">Duration *</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              placeholder="e.g., 3 months"
            />
          </div>

          <div className="form-group">
            <label htmlFor="stipend">Stipend (Monthly in ₹) *</label>
            <input
              type="number"
              id="stipend"
              name="stipend"
              value={formData.stipend}
              onChange={handleChange}
              required
              placeholder="Enter monthly stipend"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Enter location"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe the internship role and responsibilities"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="requirements">Requirements *</label>
          <textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            required
            placeholder="List required skills and qualifications"
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="applicationDeadline">Application Deadline *</label>
            <input
              type="date"
              id="applicationDeadline"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Adding...' : 'Add Internship'}
        </button>
      </form>
    </div>
  );
}

export default AddInternship;
