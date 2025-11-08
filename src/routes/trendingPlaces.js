// src/routes/trendingPlaces.js
import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// Get trending tour places (most reviewed or highest rated)
router.get('/', async (req, res) => {
  try {
    const tourPlaces = await prisma.tourPlace.findMany({
      include: {
        district: {
          include: {
            division: true
          }
        },
        tourPlaceReviews: true
      },
      orderBy: {
        tourPlaceReviews: {
          _count: 'desc'
        }
      },
      take: 10 // Get top 10 trending
    });

    const transformedTourPlaces = tourPlaces.map(place => ({
      id: place.id,
      name: place.name,
      price: 50,
      currency: 'USD',
      duration: 1,
      difficulty: 'Easy',
      rating: place.tourPlaceReviews.length > 0 
        ? place.tourPlaceReviews.reduce((sum, review) => sum + review.rating, 0) / place.tourPlaceReviews.length 
        : 4.0,
      image: place.imageUrl || '/placeholder-image.jpg',
      location: `${place.district.name}, ${place.district.division.name}`,
      description: place.description || 'Explore this beautiful tourist destination.',
      reviewCount: place.tourPlaceReviews.length
    }));

    res.json(transformedTourPlaces);
  } catch (err) {
    console.error('Error fetching trending places:', err);
    res.status(500).json({ error: 'Failed to fetch trending places' });
  }
});

export default router;