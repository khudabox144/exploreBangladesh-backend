// src/routes/divisions.js - UPDATED
import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// Create Division (admin)
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Division name required' });
  try {
    const division = await prisma.division.create({ data: { name } });
    res.status(201).json(division);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create division' });
  }
});

// List all Divisions with districts and CORRECT tour places count
router.get('/', async (req, res) => {
  try {
    const divisions = await prisma.division.findMany({ 
      include: { 
        districts: {
          include: {
            tourPlaces: true // Include tourPlaces to count them
          }
        } 
      } 
    });
    
    // Transform data with CORRECT tour places count
    const transformedDivisions = divisions.map(division => ({
      id: division.id,
      name: division.name,
      districts: division.districts.map(district => ({
        id: district.id,
        name: district.name,
        tourPlaces: district.tourPlaces.length, // This should now show the actual count
        averageRating: 4.0 // Default for now
      }))
    }));

    console.log('Divisions with tour counts:', transformedDivisions); // Debug log
    res.json(transformedDivisions);
  } catch (err) {
    console.error('Error fetching divisions:', err);
    res.status(500).json({ error: 'Failed to fetch divisions' });
  }
});

// Get single division by name with detailed district info
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    
    const division = await prisma.division.findFirst({
      where: {
        name: {
          contains: name,
          mode: 'insensitive'
        }
      },
      include: {
        districts: {
          include: {
            tourPlaces: true // Include tourPlaces to count them
          }
        }
      }
    });

    if (!division) {
      return res.status(404).json({ error: 'Division not found' });
    }

    // Transform data with CORRECT counts
    const transformedDivision = {
      id: division.id,
      name: division.name,
      districts: division.districts.map(district => ({
        id: district.id,
        name: district.name,
        tourPlaces: district.tourPlaces.length, // Actual count
        averageRating: 4.0
      }))
    };

    res.json(transformedDivision);
  } catch (err) {
    console.error('Error fetching division:', err);
    res.status(500).json({ error: 'Failed to fetch division' });
  }
});

export default router;