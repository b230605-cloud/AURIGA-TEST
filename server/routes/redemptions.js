import express from 'express';
import Member from '../models/Member.js';
import Redemption from '../models/Redemption.js';

const router = express.Router();

const REDEMPTION_ITEMS = {
  'Free Coffee': 150,
  'Free Pastry': 100,
  'Free Sandwich': 250,
  'Free Dessert': 120,
  '10% Discount': 80,
  'Free Beverage': 130
};

router.post('/redeem', async (req, res) => {
  try {
    const { memberId, itemName } = req.body;

    if (!memberId || !itemName) {
      return res.status(400).json({ error: 'memberId and itemName required' });
    }

    if (!REDEMPTION_ITEMS[itemName]) {
      return res.status(400).json({ error: 'Invalid item' });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const pointsNeeded = REDEMPTION_ITEMS[itemName];
    if (member.pointsBalance < pointsNeeded) {
      return res.status(400).json({
        error: `Insufficient points. Need ${pointsNeeded}, have ${member.pointsBalance}`
      });
    }

    member.pointsBalance -= pointsNeeded;
    member.updatedAt = new Date();
    await member.save();

    const redemption = new Redemption({
      memberId,
      pointsRedeemed: pointsNeeded,
      itemName
    });
    await redemption.save();

    res.status(201).json({
      message: 'Redemption successful',
      itemName,
      pointsRedeemed: pointsNeeded,
      newBalance: member.pointsBalance,
      redemption
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/available-items', (req, res) => {
  res.json({
    items: Object.entries(REDEMPTION_ITEMS).map(([name, points]) => ({
      name,
      pointsRequired: points
    }))
  });
});

router.get('/history/:memberId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const redemptions = await Redemption.find({ memberId: req.params.memberId })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ timestamp: -1 });

    const total = await Redemption.countDocuments({ memberId: req.params.memberId });

    res.json({
      redemptions,
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
