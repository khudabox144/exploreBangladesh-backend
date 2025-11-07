// src/db.js - FIXED
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await prisma.$disconnect();
  } finally {
    process.exit(0);
  }
});

export default prisma;