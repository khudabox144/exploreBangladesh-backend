// src/routes/districts.js
import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// Create District
router.post('/', async (req, res) => {
  const { name, divisionId } = req.body;
  if (!name || !divisionId) return res.status(400).json({ error: 'Name and divisionId required' });
  
  try {
    const district = await prisma.district.create({
      data: { 
        name, 
        division: { connect: { id: Number(divisionId) } } 
      },
      include: {
        division: true,
        tourPlaces: true
      }
    });
    res.status(201).json(district);
  } catch (err) {
    console.error('District creation error:', err);
    res.status(500).json({ error: 'Failed to create district' });
  }
});

// List Districts in a Division
router.get('/division/:divisionId', async (req, res) => {
  const divisionId = Number(req.params.divisionId);
  
  try {
    const districts = await prisma.district.findMany({ 
      where: { divisionId }, 
      include: { 
        division: true,
        tourPlaces: true 
      } 
    });
    res.json(districts);
  } catch (err) {
    console.error('Districts fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch districts' });
  }
});

// Get all districts
router.get('/', async (req, res) => {
  try {
    const districts = await prisma.district.findMany({
      include: {
        division: true,
        tourPlaces: true
      }
    });
    res.json(districts);
  } catch (err) {
    console.error('Districts fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch districts' });
  }
});

export default router;