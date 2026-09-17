import express from 'express';
import Member from '../models/Member.js';

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const { phoneNumber, page = 1, limit = 10 } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number required' });
    }

    const skip = (page - 1) * limit;
    const members = await Member.find({ phoneNumber: new RegExp(phoneNumber, 'i') })
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Member.countDocuments({ phoneNumber: new RegExp(phoneNumber, 'i') });

    res.json({
      members,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).select('-password');
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    const members = await Member.find()
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sort);

    const total = await Member.countDocuments();

    res.json({
      members,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
