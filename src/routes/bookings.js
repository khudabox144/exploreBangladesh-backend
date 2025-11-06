import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// Create a booking
router.post('/', async (req, res) => {
  const { userId, tourId, seats = 1, totalPrice, currency } = req.body;
  if (!userId || !tourId || totalPrice == null) return res.status(400).json({ error: 'userId, tourId and totalPrice required' });

  try {
    // Basic existence checks (optional)
    const [user, tour] = await Promise.all([
      prisma.user.findUnique({ where: { id: Number(userId) } }),
      prisma.tour.findUnique({ where: { id: Number(tourId) } }),
    ]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!tour) return res.status(404).json({ error: 'Tour not found' });

    const booking = await prisma.booking.create({
      data: {
        user: { connect: { id: Number(userId) } },
        tour: { connect: { id: Number(tourId) } },
        seats: Number(seats),
        totalPrice: Number(totalPrice),
        currency: currency || 'USD',
      },
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get a booking
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid id' });

  try {
    const booking = await prisma.booking.findUnique({ where: { id }, include: { user: true, tour: true } });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

export default router;
