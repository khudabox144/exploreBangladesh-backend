import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// Get tour places by division and district
router.get('/', async (req, res) => {
  try {
    const { division, district } = req.query;
    
    let whereClause = {};
    
    if (division && district) {
      // Find tour places by division and district name
      whereClause = {
        district: {
          name: { contains: district, mode: 'insensitive' },
          division: {
            name: { contains: division, mode: 'insensitive' }
          }
        }
      };
    } else if (division) {
      // Find tour places by division only
      whereClause = {
        district: {
          division: {
            name: { contains: division, mode: 'insensitive' }
          }
        }
      };
    } else if (district) {
      // Find tour places by district only
      whereClause = {
        district: {
          name: { contains: district, mode: 'insensitive' }
        }
      };
    }

    const tourPlaces = await prisma.tourPlace.findMany({
      where: whereClause,
      include: {
        district: {
          include: {
            division: true
          }
        },
        tourPlaceReviews: true
      },
      orderBy: { name: 'asc' },
    });

    // Transform data to match frontend expectations
    const transformedTourPlaces = tourPlaces.map(place => ({
      id: place.id,
      name: place.name,
      price: 50, // Default price since it's not in TourPlace model
      currency: 'USD',
      duration: 1, // Default duration
      difficulty: 'Easy', // Default difficulty
      rating: place.tourPlaceReviews.length > 0 
        ? place.tourPlaceReviews.reduce((sum, review) => sum + review.rating, 0) / place.tourPlaceReviews.length 
        : 4.0,
      image: place.imageUrl || '/placeholder-image.jpg',
      location: `${place.district.name}, ${place.district.division.name}`,
      description: place.description || 'Explore this beautiful tourist destination.',
      fullDescription: place.description || 'A wonderful place to visit with rich cultural heritage and natural beauty.',
      highlights: [
        'Beautiful scenery',
        'Cultural experience',
        'Photography opportunities'
      ],
      included: ['Professional guide', 'Transportation'],
      requirements: ['Comfortable shoes', 'Camera', 'Water bottle']
    }));

    res.json(transformedTourPlaces);
  } catch (err) {
    console.error('Error fetching tour places:', err);
    res.status(500).json({ error: 'Failed to fetch tour places' });
  }
});

// Get all tour places (optional)
router.get('/all', async (req, res) => {
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
      orderBy: { name: 'asc' },
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
      district: place.district.name,
      division: place.district.division.name
    }));

    res.json(transformedTourPlaces);
  } catch (err) {
    console.error('Error fetching all tour places:', err);
    res.status(500).json({ error: 'Failed to fetch tour places' });
  }
});

export default router;