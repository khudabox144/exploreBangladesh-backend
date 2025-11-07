import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// Get tour places by division and district
router.get('/', async (req, res) => {
  try {
    const { division, district } = req.query;
    
    let whereClause = {};
    
    if (division && district) {
      // Find tours by division and district name
      whereClause = {
        location: {
          district: {
            name: { contains: district, mode: 'insensitive' },
            division: {
              name: { contains: division, mode: 'insensitive' }
            }
          }
        }
      };
    } else if (division) {
      // Find tours by division only
      whereClause = {
        location: {
          district: {
            division: {
              name: { contains: division, mode: 'insensitive' }
            }
          }
        }
      };
    } else if (district) {
      // Find tours by district only
      whereClause = {
        location: {
          district: {
            name: { contains: district, mode: 'insensitive' }
          }
        }
      };
    }

    const tourPlaces = await prisma.tour.findMany({
      where: whereClause,
      include: {
        images: true,
        location: {
          include: {
            district: {
              include: {
                division: true
              }
            }
          }
        },
        operator: true,
        priceOptions: true,
        categories: true,
        reviews: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform data to match frontend expectations
    const transformedTours = tourPlaces.map(tour => ({
      id: tour.id,
      name: tour.title,
      price: tour.basePrice,
      currency: tour.currency,
      duration: tour.durationDays,
      difficulty: tour.categories[0]?.name || 'Medium', // Use first category as difficulty
      rating: tour.reviews.length > 0 
        ? tour.reviews.reduce((sum, review) => sum + review.rating, 0) / tour.reviews.length 
        : 4.0,
      image: tour.images[0]?.url || '/placeholder-image.jpg',
      location: tour.location?.name || 'Bangladesh',
      description: tour.description,
      fullDescription: tour.description, // You might want to add a separate fullDescription field
      highlights: tour.categories.map(cat => cat.name),
      included: ['Professional guide', 'Transportation'], // Default values
      requirements: ['Comfortable shoes', 'Camera'] // Default values
    }));

    res.json(transformedTours);
  } catch (err) {
    console.error('Error fetching tour places:', err);
    res.status(500).json({ error: 'Failed to fetch tour places' });
  }
});

export default router;