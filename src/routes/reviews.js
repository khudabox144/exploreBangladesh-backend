import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// Create a review
router.post('/', async (req, res) => {
  const { userId, tourId, rating, title, text } = req.body;
  if (!userId || !tourId || rating == null) return res.status(400).json({ error: 'userId, tourId and rating required' });

  try {
    const review = await prisma.review.create({
      data: {
        user: { connect: { id: Number(userId) } },
        tour: { connect: { id: Number(tourId) } },
        rating: Number(rating),
        title,
        text,
      },
    });
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// List reviews for a tour
router.get('/tour/:tourId', async (req, res) => {
  const tourId = Number(req.params.tourId);
  if (!tourId) return res.status(400).json({ error: 'Invalid tourId' });

  try {
    const reviews = await prisma.review.findMany({ where: { tourId }, include: { user: true }, orderBy: { createdAt: 'desc' } });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list reviews' });
  }
});

export default router;
