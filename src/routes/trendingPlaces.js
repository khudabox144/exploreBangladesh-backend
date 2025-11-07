import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// Get trending places (top by average rating)
router.get('/', async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  try {
    // Aggregate average rating and review count for each TourPlace
    const trending = await prisma.tourPlace.findMany({
      include: {
        tourPlaceReviews: true
      }
    });

    // Calculate average rating and sort
    const sorted = trending
      .map(tp => {
        const reviews = tp.tourPlaceReviews;
        const avgRating = reviews.length
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;
        return { ...tp, avgRating, reviewCount: reviews.length };
      })
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, limit);

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending places' });
  }
});

export default router;
