if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
