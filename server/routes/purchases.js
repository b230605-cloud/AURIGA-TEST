import express from 'express';
import Member from '../models/Member.js';
import Purchase from '../models/Purchase.js';

const router = express.Router();

router.post('/record', async (req, res) => {
  try {
    const { memberId, amount, description } = req.body;

    if (!memberId || !amount) {
      return res.status(400).json({ error: 'memberId and amount required' });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const basePoints = Math.floor(amount * 10);
    const tierMultiplier = member.getTierMultiplier();
    const pointsAwarded = Math.floor(basePoints * tierMultiplier);

    member.pointsBalance += pointsAwarded;
    member.totalPointsEarned += pointsAwarded;
    member.updateTier();
    member.updatedAt = new Date();
    await member.save();

    const purchase = new Purchase({
      memberId,
      amount,
      pointsAwarded,
      tierMultiplier,
      description
    });
    await purchase.save();

    res.status(201).json({
      message: 'Purchase recorded successfully',
      pointsAwarded,
      newBalance: member.pointsBalance,
      tier: member.tier,
      purchase
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/history/:memberId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const purchases = await Purchase.find({ memberId: req.params.memberId })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ timestamp: -1 });

    const total = await Purchase.countDocuments({ memberId: req.params.memberId });

    res.json({
      purchases,
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
