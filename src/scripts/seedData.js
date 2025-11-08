// src/scripts/seedData.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.tourPlaceReview.deleteMany();
  await prisma.tourPlace.deleteMany();
  await prisma.district.deleteMany();
  await prisma.division.deleteMany();

  // Create Divisions
  const divisions = await Promise.all([
    prisma.division.create({ data: { name: 'Dhaka' } }),
    prisma.division.create({ data: { name: 'Chittagong' } }),
    prisma.division.create({ data: { name: 'Sylhet' } }),
    prisma.division.create({ data: { name: 'Khulna' } }),
  ]);

  console.log('✅ Created divisions');

  // Create Districts
  const districts = await Promise.all([
    // Chittagong Division Districts
    prisma.district.create({ 
      data: { 
        name: 'Bagerhat', 
        division: { connect: { id: divisions[1].id } } 
      } 
    }),
    prisma.district.create({ 
      data: { 
        name: 'Chittagong District', 
        division: { connect: { id: divisions[1].id } } 
      } 
    }),
    prisma.district.create({ 
      data: { 
        name: 'Cox\'s Bazar', 
        division: { connect: { id: divisions[1].id } } 
      } 
    }),
    
    // Dhaka Division Districts
    prisma.district.create({ 
      data: { 
        name: 'Dhaka District', 
        division: { connect: { id: divisions[0].id } } 
      } 
    }),
  ]);

  console.log('✅ Created districts');

  // Create Tour Places for Bagerhat district
  const bagerhatTourPlaces = await Promise.all([
    prisma.tourPlace.create({
      data: {
        name: 'Shat Gombuj Mosque',
        description: 'A 15th-century mosque and UNESCO World Heritage Site with sixty pillars and seventy-seven domes.',
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-8cbd5d1a45f9?w=400&h=300&fit=crop',
        district: { connect: { id: districts[0].id } }
      }
    }),
    prisma.tourPlace.create({
      data: {
        name: 'Khan Jahan Ali Bridge',
        description: 'Historic bridge built by the famous saint Khan Jahan Ali in the 15th century.',
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-8cbd5d1a45f9?w=400&h=300&fit=crop',
        district: { connect: { id: districts[0].id } }
      }
    }),
    prisma.tourPlace.create({
      data: {
        name: 'Bagerhat Museum',
        description: 'Museum showcasing the history and heritage of the Bagerhat region.',
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-8cbd5d1a45f9?w=400&h=300&fit=crop',
        district: { connect: { id: districts[0].id } }
      }
    }),
  ]);

  // Add some reviews
  await Promise.all([
    prisma.tourPlaceReview.create({
      data: {
        userId: 1,
        tourPlaceId: bagerhatTourPlaces[0].id,
        rating: 5,
        comment: 'Amazing historical site! Must visit.'
      }
    }),
    prisma.tourPlaceReview.create({
      data: {
        userId: 1,
        tourPlaceId: bagerhatTourPlaces[1].id,
        rating: 4,
        comment: 'Beautiful architecture and peaceful environment.'
      }
    }),
  ]);

  console.log('✅ Created tour places and reviews');
  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });