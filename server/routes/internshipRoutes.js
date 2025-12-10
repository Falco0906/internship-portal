const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const mongoose = require('mongoose');

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// GET all internships
router.get('/', asyncHandler(async (req, res) => {
  // Check MongoDB connection before querying
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: 'Database connection not ready',
      error: 'MongoDB connection is not established',
      readyState: mongoose.connection.readyState
    });
  }
  
  const internships = await Internship.find().sort({ createdAt: -1 });
  res.json(internships || []);
}));

// GET single internship by ID
router.get('/:id', async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.json(internship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE new internship
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['companyName', 'position', 'duration', 'stipend', 'location', 'description', 'requirements', 'applicationDeadline', 'startDate'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const internship = new Internship({
      companyName: req.body.companyName,
      position: req.body.position,
      duration: req.body.duration,
      stipend: req.body.stipend,
      location: req.body.location,
      description: req.body.description,
      requirements: req.body.requirements,
      applicationDeadline: req.body.applicationDeadline,
      startDate: req.body.startDate
    });

    const newInternship = await internship.save();
    res.status(201).json(newInternship);
  } catch (err) {
    console.error('Error creating internship:', err);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE internship
router.put('/:id', async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    if (req.body.companyName !== undefined) internship.companyName = req.body.companyName;
    if (req.body.position !== undefined) internship.position = req.body.position;
    if (req.body.duration !== undefined) internship.duration = req.body.duration;
    if (req.body.stipend !== undefined) internship.stipend = req.body.stipend;
    if (req.body.location !== undefined) internship.location = req.body.location;
    if (req.body.description !== undefined) internship.description = req.body.description;
    if (req.body.requirements !== undefined) internship.requirements = req.body.requirements;
    if (req.body.applicationDeadline !== undefined) internship.applicationDeadline = req.body.applicationDeadline;
    if (req.body.startDate !== undefined) internship.startDate = req.body.startDate;
    
    internship.updatedAt = Date.now();

    const updatedInternship = await internship.save();
    res.json(updatedInternship);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE internship
router.delete('/:id', async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Internship deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
