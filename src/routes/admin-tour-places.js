// src/routes/admin-tour-places.js - IMPROVED VERSION
import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// Create a new tour place
router.post('/', async (req, res) => {
  try {
    console.log('Received request to create tour place:', req.body);
    
    const { name, description, imageUrl, districtId } = req.body;
    
    if (!name || !districtId) {
      return res.status(400).json({ 
        error: 'Name and districtId are required',
        received: { name, districtId }
      });
    }

    // Check if district exists
    const district = await prisma.district.findUnique({
      where: { id: Number(districtId) }
    });

    if (!district) {
      return res.status(404).json({ 
        error: 'District not found',
        districtId 
      });
    }

    const tourPlace = await prisma.tourPlace.create({
      data: {
        name,
        description: description || `Explore the beautiful ${name} in this district.`,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1540959733332-8cbd5d1a45f9?w=400&h=300&fit=crop',
        districtId: Number(districtId)
      },
      include: {
        district: {
          include: {
            division: true
          }
        }
      }
    });

    console.log('Tour place created successfully:', tourPlace.id);

    res.status(201).json({
      message: 'Tour place created successfully',
      tourPlace
    });
  } catch (err) {
    console.error('Error creating tour place:', err);
    res.status(500).json({ 
      error: 'Failed to create tour place',
      details: err.message 
    });
  }
});

// Get all districts with divisions (for dropdown)
router.get('/districts', async (req, res) => {
  try {
    const districts = await prisma.district.findMany({
      include: {
        division: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log(`Found ${districts.length} districts`);

    res.json(districts);
  } catch (err) {
    console.error('Error fetching districts:', err);
    res.status(500).json({ 
      error: 'Failed to fetch districts',
      details: err.message 
    });
  }
});

// Get all tour places (for admin view)
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
        createdAt: 'desc'
      }
    });

    res.json(tourPlaces);
  } catch (err) {
    console.error('Error fetching tour places:', err);
    res.status(500).json({ 
      error: 'Failed to fetch tour places',
      details: err.message 
    });
  }
});

export default router;


