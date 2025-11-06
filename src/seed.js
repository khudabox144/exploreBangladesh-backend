import prisma from './db.js';

async function main() {
  // Create Operator
  const operator = await prisma.operator.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Himalaya Expeditions',
      description: 'Expert guides for Himalayan adventures',
      website: 'https://himalayaexpeditions.example.com',
    },
  });

  // Create Location
  const location = await prisma.location.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Himalayan Mountains',
      country: 'Nepal',
      latitude: 28.5983,
      longitude: 83.9311,
    },
  });

  // Create Category
  const category = await prisma.category.upsert({
    where: { slug: 'adventure' },
    update: {},
    create: {
      name: 'Adventure',
      slug: 'adventure',
    },
  });

  // Create Tour
  const tour = await prisma.tour.upsert({
    where: { slug: 'majestic-himalaya-adventure' },
    update: {},
    create: {
      title: 'Majestic Himalaya Adventure',
      slug: 'majestic-himalaya-adventure',
      description: 'An unforgettable 10-day trekking journey through the breathtaking Himalayan mountains.',
      durationDays: 10,
      difficulty: 'Hard',
      capacity: 20,
      startDate: new Date('2025-12-15T00:00:00.000Z'),
      endDate: new Date('2025-12-25T00:00:00.000Z'),
      currency: 'USD',
      basePrice: 1299.99,
      operator: { connect: { id: operator.id } },
      location: { connect: { id: location.id } },
      categories: { connect: [{ id: category.id }] },
    },
  });

  console.log('Seeded Operator:', operator);
  console.log('Seeded Location:', location);
  console.log('Seeded Category:', category);
  console.log('Seeded Tour:', tour);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });