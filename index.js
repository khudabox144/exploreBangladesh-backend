import express from 'express';
import dotenv from 'dotenv';
import toursRouter from './src/routes/tours.js';
import usersRouter from './src/routes/users.js';
import bookingsRouter from './src/routes/bookings.js';
import reviewsRouter from './src/routes/reviews.js';
import prisma from './src/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => res.json({ ok: true, message: 'Tour API running' }));

app.use('/api/tours', toursRouter);
app.use('/api/users', usersRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/reviews', reviewsRouter);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
