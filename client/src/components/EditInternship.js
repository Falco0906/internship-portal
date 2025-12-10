import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditInternship.css';

function EditInternship({ internshipId, onClose, onSave }) {
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInternship();
  }, [internshipId]);

  const fetchInternship = async () => {
    try {
      const response = await axios.get(`/api/internships/${internshipId}`);
      const data = response.data;
      setFormData({
        companyName: data.companyName,
        position: data.position,
        duration: data.duration,
        stipend: data.stipend,
        location: data.location,
        description: data.description,
        requirements: data.requirements,
        applicationDeadline: data.applicationDeadline.split('T')[0],
        startDate: data.startDate.split('T')[0]
      });
      setLoading(false);
    } catch (err) {
      setError('Error loading internship details.');
      console.error('Error:', err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedData = {
        ...formData,
        stipend: parseFloat(formData.stipend)
      };
      onSave(updatedData);
    } catch (err) {
      setError('Error saving internship. Please try again.');
      console.error('Error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="edit-modal"><div className="modal-content"><p>Loading...</p></div></div>;
  }

  return (
    <div className="edit-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Internship</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

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
              />
            </div>

            <div className="form-group">
              <label htmlFor="stipend">Stipend (₹) *</label>
              <input
                type="number"
                id="stipend"
                name="stipend"
                value={formData.stipend}
                onChange={handleChange}
                required
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
              rows="3"
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

          <div className="form-actions">
            <button type="submit" disabled={saving} className="save-btn">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditInternship;
