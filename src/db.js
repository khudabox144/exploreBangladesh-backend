// src/db.js
import { PrismaClient } from './generated/client/index.js'; // './' because db.js is inside src/
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
