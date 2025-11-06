import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// List tours
router.get('/', async (req, res) => {
  try {
    const tours = await prisma.tour.findMany({
      include: {
        images: true,
        location: true,
        operator: true,
        priceOptions: true,
        categories: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list tours' });
  }
});

// Get a single tour
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid id' });

  try {
    const tour = await prisma.tour.findUnique({
      where: { id },
      include: {
        images: true,
        location: true,
        operator: true,
        itineraries: { orderBy: { day: 'asc' } },
        priceOptions: true,
        categories: true,
        reviews: true,
      },
    });
    if (!tour) return res.status(404).json({ error: 'Tour not found' });
    res.json(tour);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tour' });
  }
});

// Create a tour (minimal)
router.post('/', async (req, res) => {
  const { title, slug, description, durationDays, basePrice, currency, locationId, operatorId, categoryIds } = req.body;
  if (!title || !slug) return res.status(400).json({ error: 'title and slug required' });

  try {
    const data = {
      title,
      slug,
      description,
      durationDays: Number(durationDays) || 1,
      basePrice: Number(basePrice) || 0,
      currency: currency || 'USD',
    };

    if (locationId) data.location = { connect: { id: Number(locationId) } };
    if (operatorId) data.operator = { connect: { id: Number(operatorId) } };
    if (Array.isArray(categoryIds) && categoryIds.length) {
      data.categories = { connect: categoryIds.map((id) => ({ id: Number(id) })) };
    }

    const tour = await prisma.tour.create({ data });
    res.status(201).json(tour);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create tour' });
  }
});

export default router;
