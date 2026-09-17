import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import memberRoutes from './routes/members.js';
import purchaseRoutes from './routes/purchases.js';
import redemptionRoutes from './routes/redemptions.js';

dotenv.config();
const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
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
