import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditInternship from '../components/EditInternship';
import './ManageInternships.css';

function ManageInternships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/internships');
      setInternships(response.data);
      setError('');
    } catch (err) {
      setError('Error fetching internships. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        await axios.delete(`/api/internships/${id}`);
        setInternships(internships.filter(internship => internship._id !== id));
        setDeleteMessage('Internship deleted successfully!');
        setTimeout(() => setDeleteMessage(''), 3000);
      } catch (err) {
        setError('Error deleting internship. Please try again.');
        console.error('Error:', err);
      }
    }
  };

  const handleEditClick = (id) => {
    setEditingId(id);
  };

  const handleEditClose = () => {
    setEditingId(null);
  };

  const handleEditSave = async (updatedData) => {
    try {
      const response = await axios.put(`/api/internships/${editingId}`, updatedData);
      setInternships(internships.map(internship =>
        internship._id === editingId ? response.data : internship
      ));
      setEditingId(null);
      setDeleteMessage('Internship updated successfully!');
      setTimeout(() => setDeleteMessage(''), 3000);
    } catch (err) {
      setError('Error updating internship. Please try again.');
      console.error('Error:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading internships...</div>;
  }

  return (
    <div className="manage-internships">
      <h1>Manage Internships</h1>

      {deleteMessage && <div className="success-message">{deleteMessage}</div>}
      {error && <div className="error-message">{error}</div>}

      {editingId && (
        <EditInternship
          internshipId={editingId}
          onClose={handleEditClose}
          onSave={handleEditSave}
        />
      )}

      {internships.length === 0 ? (
        <div className="empty-state">
          <p>No internships found. Add one to get started!</p>
        </div>
      ) : (
        <div className="internships-grid">
          {internships.map(internship => (
            <div key={internship._id} className="internship-card">
              <div className="card-header">
                <h2>{internship.companyName}</h2>
                <span className="position">{internship.position}</span>
              </div>

              <div className="card-body">
                <p><strong>Location:</strong> {internship.location}</p>
                <p><strong>Duration:</strong> {internship.duration}</p>
                <p><strong>Stipend:</strong> ₹{internship.stipend}/month</p>
                
                <div className="dates">
                  <p><strong>Application Deadline:</strong> {new Date(internship.applicationDeadline).toLocaleDateString()}</p>
                  <p><strong>Start Date:</strong> {new Date(internship.startDate).toLocaleDateString()}</p>
                </div>

                <p><strong>Description:</strong></p>
                <p className="description">{internship.description}</p>

                <p><strong>Requirements:</strong></p>
                <p className="requirements">{internship.requirements}</p>
              </div>

              <div className="card-footer">
                <button 
                  className="edit"
                  onClick={() => handleEditClick(internship._id)}
                >
                  Edit
                </button>
                <button 
                  className="delete"
                  onClick={() => handleDelete(internship._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageInternships;
