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
// IMPORTANT: Connection string must include database name (/internship_portal)
// Set MONGODB_URI in Render Environment tab, not here!
// Format: mongodb+srv://username:password@cluster.mongodb.net/internship_portal?retryWrites=true&w=majority
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/internship_portal';

// Auto-fix connection string if database name is missing (for common cases)
let finalMongoURI = mongoURI;
if (mongoURI.includes('mongodb+srv://') && !mongoURI.includes('/internship_portal') && mongoURI.includes('/?')) {
  // Replace /? with /internship_portal? and update query params
  finalMongoURI = mongoURI.replace('/?', '/internship_portal?').replace('appName=Cluster0', 'retryWrites=true&w=majority');
  console.log('⚠️  Fixed connection string: Added database name and updated query parameters');
}

// MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 2, // Maintain at least 2 socket connections
  retryWrites: true,
  w: 'majority'
};

mongoose.connect(finalMongoURI, mongooseOptions)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Error name:', err.name);
    console.error('Error code:', err.code);
    if (err.reason) {
      console.error('Topology type:', err.reason.type);
    }
    console.error('Connection string:', finalMongoURI.replace(/:[^:]*@/, ':****@'));
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

// MongoDB connection check middleware
const checkMongoConnection = (req, res, next) => {
  const readyState = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (readyState === 0) {
    console.error('MongoDB is disconnected. ReadyState:', readyState);
    return res.status(503).json({ 
      error: 'Database connection not available',
      message: 'MongoDB is disconnected. Please check connection string.',
      readyState: readyState
    });
  }
  // Allow connecting state (2) to proceed, but log a warning
  if (readyState === 2) {
    console.warn('MongoDB is still connecting. ReadyState:', readyState);
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
