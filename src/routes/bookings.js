// src/routes/bookings.js
import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// Create booking
router.post('/', async (req, res) => {
  const { userId, tourId, seats, totalPrice, currency } = req.body;
  
  if (!userId || !tourId || !seats || !totalPrice) {
    return res.status(400).json({ error: 'userId, tourId, seats, and totalPrice required' });
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        user: { connect: { id: Number(userId) } },
        tour: { connect: { id: Number(tourId) } },
        seats: Number(seats),
        totalPrice: Number(totalPrice),
        currency: currency || 'USD',
      },
      include: {
        user: true,
        tour: true
      }
    });
    res.status(201).json(booking);
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get user bookings
router.get('/user/:userId', async (req, res) => {
  const userId = Number(req.params.userId);
  if (!userId) return res.status(400).json({ error: 'Invalid userId' });

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        tour: {
          include: {
            location: true,
            operator: true
          }
        }
      },
      orderBy: { bookedAt: 'desc' }
    });
    res.json(bookings);
  } catch (err) {
    console.error('Bookings fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

export default router;