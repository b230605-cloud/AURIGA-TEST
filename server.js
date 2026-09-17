import express from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import connectDB from './server/config/db.js';
import authRoutes from './server/routes/auth.js';
import memberRoutes from './server/routes/members.js';
import purchaseRoutes from './server/routes/purchases.js';
import redemptionRoutes from './server/routes/redemptions.js';
import clockRoutes from './server/routes/clock.js';
import outboxRoutes from './server/routes/outbox.js';
import { apiLimiter, authLimiter } from './server/middleware/rateLimit.js';
import { requireAuth } from './server/middleware/auth.js';

dotenv.config();
const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.CLIENT_URL,
      // Allow Codespaces origins
      ...(origin && origin.includes('github.dev') ? [origin] : [])
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(compression());
app.use(express.json());

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/members', requireAuth, memberRoutes);
app.use('/api/purchases', requireAuth, purchaseRoutes);
app.use('/api/redemptions', requireAuth, redemptionRoutes);
app.use('/clock', clockRoutes);
app.use('/outbox', outboxRoutes);
app.use('/api/clock', clockRoutes);
app.use('/api/outbox', outboxRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

export default app;

export async function startServer() {
  await connectDB();
  return app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📊 MongoDB connected: ${process.env.MONGODB_URI?.split('@')[1] || 'local'}`);
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  startServer();
}
