const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/internship_portal';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Connection string:', mongoURI.replace(/:[^:]*@/, ':****@'));
  });

// MongoDB connection check middleware
const checkMongoConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      error: 'Database connection not available',
      message: 'Please check MongoDB connection string'
    });
  }
  next();
};

// Import Routes
const internshipRoutes = require('./routes/internshipRoutes');

// Use Routes (must be before static file serving)
app.use('/api/internships', checkMongoConnection, internshipRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' 
  });
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files (excluding index.html for now)
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Serve React app for all non-API routes (SPA fallback)
  // This must come after all API routes
  app.get('*', (req, res) => {
    // Only serve index.html for non-API routes
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    }
  });
} else {
  // Default Route for development
  app.get('/', (req, res) => {
    res.json({ message: 'Internship Portal API is running' });
  });
}

// 404 handler for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found', path: req.path });
});

// Error Handling Middleware (must be last)
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({ 
    error: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
