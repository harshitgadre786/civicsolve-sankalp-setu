import dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'sankalp-setu-civicsolve-super-secret-key-2026';
}

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import apiRouter from './routes/api';

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Mount API routes
app.use('/api', apiRouter);

// Serve Frontend client build in production if available
const clientDistCandidates = [
  path.resolve(__dirname, '../../../client/dist'),
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(process.cwd(), '../client/dist'),
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(__dirname, '../public'),
  path.resolve(process.cwd(), 'public')
];
const resolvedDist = clientDistCandidates.find(p => fs.existsSync(p));

if (resolvedDist) {
  console.log(`📦 Serving static client build from: ${resolvedDist}`);
  app.use(express.static(resolvedDist));
  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(resolvedDist, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.json({
      message: 'CivicSolve / Sankalp Setu Backend API is running.',
      docs: '/api/health'
    });
  });
}

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Unhandled Error]:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, HOST, async () => {
  console.log(`🚀 CivicSolve API server listening on http://${HOST}:${PORT}`);
  console.log(`📡 Health endpoint: http://${HOST}:${PORT}/api/health`);

  // Ensure database has seeded demonstration records on any fresh cloud deployment
  try {
    const prisma = (await import('./db')).default;
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('🌱 Fresh deployment detected (0 users). Auto-seeding CivicSolve dataset...');
      const seedModule = await import('../prisma/seed');
      if (typeof seedModule.main === 'function') {
        await seedModule.main();
        console.log('✅ Initial database seed applied successfully.');
      }
    } else {
      console.log(`📊 Connected to database with ${userCount} registered users.`);
    }
  } catch (dbErr: any) {
    console.warn('ℹ️ Startup database sync notice:', dbErr?.message || dbErr);
  }
});
