// src/routes/tourPlaces.js
import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// Create TourPlace
router.post('/', async (req, res) => {
  const { name, description, imageUrl, districtId, addedBy } = req.body;
  if (!name || !districtId) return res.status(400).json({ error: 'Name and districtId required' });
  
  try {
    const tourPlace = await prisma.tourPlace.create({
      data: { 
        name, 
        description, 
        imageUrl, 
        district: { connect: { id: Number(districtId) } }, 
        addedBy 
      },
      include: {
        district: {
          include: {
            division: true
          }
        }
      }
    });
    res.status(201).json(tourPlace);
  } catch (err) {
    console.error('TourPlace creation error:', err);
    res.status(500).json({ error: 'Failed to create tour place' });
  }
});

// Get all tour places
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
      }
    });
    res.json(tourPlaces);
  } catch (err) {
    console.error('TourPlaces fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch tour places' });
  }
});

// Get tour places by district
router.get('/district/:districtId', async (req, res) => {
  const districtId = Number(req.params.districtId);
  
  try {
    const tourPlaces = await prisma.tourPlace.findMany({ 
      where: { districtId },
      include: {
        district: true,
        tourPlaceReviews: true
      }
    });
    res.json(tourPlaces);
  } catch (err) {
    console.error('TourPlaces by district fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch tour places' });
  }
});

// Add review to a TourPlace
router.post('/:id/reviews', async (req, res) => {
  const tourPlaceId = Number(req.params.id);
  const { userId, rating, comment } = req.body;
  
  if (!userId || !rating) return res.status(400).json({ error: 'userId and rating required' });
  
  try {
    const review = await prisma.tourPlaceReview.create({
      data: { 
        userId: Number(userId), 
        tourPlaceId, 
        rating: Number(rating), 
        comment 
      },
      include: {
        tourPlace: true
      }
    });
    res.status(201).json(review);
  } catch (err) {
    console.error('TourPlace review creation error:', err);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

export default router;