// src/routes/tourPlaces.js - UPDATED
import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// Get tour places by division and district - FIXED
router.get('/', async (req, res) => {
  try {
    const { division, district } = req.query;
    
    console.log('Query params:', { division, district });

    let whereClause = {};
    
    if (division && district) {
      // Use case-insensitive contains for better matching
      whereClause = {
        district: {
          name: { 
            contains: district, 
            mode: 'insensitive' 
          },
          division: {
            name: { 
              contains: division, 
              mode: 'insensitive' 
            }
          }
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

    console.log('Found tour places:', tourPlaces.length);

    // Transform data to match frontend expectations
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
      description: place.description || `Explore ${place.name} in ${place.district.name}.`,
      fullDescription: place.description || `${place.name} is a wonderful tourist destination in ${place.district.name}, ${place.district.division.name}.`,
      highlights: ['Beautiful scenery', 'Cultural experience', 'Photography opportunities'],
      included: ['Professional guide', 'Transportation'],
      requirements: ['Comfortable shoes', 'Camera']
    }));

    res.json(transformedTourPlaces);
  } catch (err) {
    console.error('Error fetching tour places:', err);
    res.status(500).json({ error: 'Failed to fetch tour places' });
  }
});

export default router;