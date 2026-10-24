import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { connectMongo, getDbStatus } from './server/db/connection.js';
import { authRouter } from './server/routes/auth.js';

dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Connect to MongoDB Atlas (if MONGODB_URI is provided, otherwise falls back gracefully)
  connectMongo().catch((err) => {
    console.log('[Server] MongoDB background init notice:', err.message);
  });

  // REST API Routes
  app.use('/api/auth', authRouter);

  app.get('/api/db-status', (req, res) => {
    res.json(getDbStatus());
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'CampusHire OS',
      timestamp: new Date().toISOString(),
      database: getDbStatus(),
    });
  });

  // Mount Vite development server in middleware mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CampusHire OS] Full-stack Server listening at http://0.0.0.0:${PORT}`);
    console.log(`[Database] Live Status: ${getDbStatus().status} (${getDbStatus().message})`);
  });
}

startServer().catch((err) => {
  console.error('[CampusHire OS] Fatal server startup error:', err);
});
