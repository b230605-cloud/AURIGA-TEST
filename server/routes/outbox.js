import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { limit = 100, since } = req.query;
    const filter = since ? { createdAt: { $gt: new Date(since) } } : {};
    const events = await Notification.find(filter).sort({ createdAt: 1 }).limit(Math.min(Number(limit) || 100, 500)).lean();
    res.json({ events, count: events.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
