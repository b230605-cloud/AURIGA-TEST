import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './server/config/db.js';
import authRoutes from './server/routes/auth.js';
import memberRoutes from './server/routes/members.js';
import purchaseRoutes from './server/routes/purchases.js';
import redemptionRoutes from './server/routes/redemptions.js';

dotenv.config();
const app = express();

connectDB();

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
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/redemptions', redemptionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 MongoDB connected: ${process.env.MONGODB_URI?.split('@')[1] || 'local'}`);
});
