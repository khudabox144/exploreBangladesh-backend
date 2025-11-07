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

// List all Divisions
router.get('/', async (req, res) => {
  const divisions = await prisma.division.findMany({ include: { districts: true } });
  res.json(divisions);
});

export default router;
