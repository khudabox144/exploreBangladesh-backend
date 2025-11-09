// server.js - UPDATED VERSION
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Import routes
import toursRouter from './src/routes/tours.js';
import usersRouter from './src/routes/users.js';
import bookingsRouter from './src/routes/bookings.js';
import reviewsRouter from './src/routes/reviews.js';
import divisionsRouter from './src/routes/divisions.js';
import districtsRouter from './src/routes/districts.js';
import tourPlacesRouter from './src/routes/tourPlaces.js';
import trendingPlacesRouter from './src/routes/trendingPlaces.js';
import adminTourPlacesRouter from './src/routes/admin-tour-places.js'; // ADD THIS LINE

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.0.103:3000'],
  credentials: true
}));

// Health check route
app.get('/', (req, res) => res.json({ 
  ok: true, 
  message: 'Tour API running successfully',
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  endpoints: [
    'GET  /api/tours',
    'GET  /api/tours/:id',
    'POST /api/tours',
    'GET  /api/users',
    'POST /api/users',
    'GET  /api/bookings', 
    'POST /api/bookings',
    'GET  /api/reviews',
    'POST /api/reviews',
    'GET  /api/divisions',
    'GET  /api/divisions/:name',
    'POST /api/divisions',
    'GET  /api/districts',
    'GET  /api/districts/division/:divisionId',
    'POST /api/districts',
    'GET  /api/tour-places',
    'GET  /api/tour-places?division=:name&district=:name',
    'GET  /api/trending-places',
    'POST /api/admin/tour-places', // ADD THIS LINE
    'GET  /api/admin/tour-places/districts' // ADD THIS LINE
  ]
}));

// API routes
app.use('/api/tours', toursRouter);
app.use('/api/users', usersRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/divisions', divisionsRouter);
app.use('/api/districts', districtsRouter);
app.use('/api/tour-places', tourPlacesRouter);
app.use('/api/trending-places', trendingPlacesRouter);
app.use('/api/admin/tour-places', adminTourPlacesRouter); // ADD THIS LINE

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      '/api/tours',
      '/api/users',
      '/api/bookings', 
      '/api/reviews',
      '/api/divisions',
      '/api/districts',
      '/api/tour-places',
      '/api/trending-places',
      '/api/admin/tour-places' // ADD THIS LINE
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://192.168.0.103:${PORT}`);
  console.log(`\n📊 Available API Endpoints:`);
  console.log(`   🔹 Tours: http://localhost:${PORT}/api/tours`);
  console.log(`   🔹 Users: http://localhost:${PORT}/api/users`);
  console.log(`   🔹 Bookings: http://localhost:${PORT}/api/bookings`);
  console.log(`   🔹 Reviews: http://localhost:${PORT}/api/reviews`);
  console.log(`   🔹 Divisions: http://localhost:${PORT}/api/divisions`);
  console.log(`   🔹 Districts: http://localhost:${PORT}/api/districts`);
  console.log(`   🔹 Tour Places: http://localhost:${PORT}/api/tour-places`);
  console.log(`   🔹 Trending Places: http://localhost:${PORT}/api/trending-places`);
  console.log(`   🔹 Admin - Add Tour Places: http://localhost:${PORT}/api/admin/tour-places`); // ADD THIS LINE
  console.log(`\n💡 Example queries:`);
  console.log(`   GET /api/tour-places?division=dhaka&district=dhaka-district`);
  console.log(`   GET /api/divisions/dhaka`);
  console.log(`   GET /api/districts/division/1`);
  console.log(`   POST /api/admin/tour-places - Add new tourist place`); // ADD THIS LINE
});


