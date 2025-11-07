// server.js - FIXED VERSION
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.0.103:3000'],
  credentials: true
}));

// Routes
app.get('/', (req, res) => res.json({ 
  ok: true, 
  message: 'Tour API running',
  endpoints: [
    '/api/tours',
    '/api/users', 
    '/api/bookings',
    '/api/reviews',
    '/api/divisions',
    '/api/districts', 
    '/api/tour-places',
    '/api/trending-places'
  ]
}));

app.use('/api/tours', toursRouter);
app.use('/api/users', usersRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/divisions', divisionsRouter);
app.use('/api/districts', districtsRouter);
app.use('/api/tour-places', tourPlacesRouter);
app.use('/api/trending-places', trendingPlacesRouter);

// 404 handler - FIXED: Use proper wildcard route
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   http://localhost:${PORT}/api/tours`);
  console.log(`   http://localhost:${PORT}/api/users`);
  console.log(`   http://localhost:${PORT}/api/bookings`);
  console.log(`   http://localhost:${PORT}/api/reviews`);
  console.log(`   http://localhost:${PORT}/api/divisions`);
  console.log(`   http://localhost:${PORT}/api/districts`);
  console.log(`   http://localhost:${PORT}/api/tour-places`);
  console.log(`   http://localhost:${PORT}/api/trending-places`);
});