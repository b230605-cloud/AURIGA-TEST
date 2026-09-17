import express from 'express';
import Member from '../models/Member.js';
import Redemption from '../models/Redemption.js';
import PointLot from '../models/PointLot.js';
import { runTransaction } from '../services/transaction.js';

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

    const pointsNeeded = REDEMPTION_ITEMS[itemName];
    const redemptionTime = req.body.timestamp ? new Date(req.body.timestamp) : new Date();
    if (Number.isNaN(redemptionTime.getTime())) return res.status(400).json({ error: 'timestamp must be a valid date' });
    const result = await runTransaction(async (session) => {
      const member = await Member.findById(memberId).session(session);
      if (!member) throw Object.assign(new Error('Member not found'), { status: 404 });
      if (member.pointsBalance < pointsNeeded) throw Object.assign(new Error(`Insufficient points. Need ${pointsNeeded}, have ${member.pointsBalance}`), { status: 400 });
      let remaining = pointsNeeded;
      const lots = await PointLot.find({ memberId, remainingPoints: { $gt: 0 }, expiresAt: { $gt: redemptionTime } }).sort({ earnedAt: 1, _id: 1 }).session(session);
      for (const lot of lots) {
        if (!remaining) break;
        const consumed = Math.min(lot.remainingPoints, remaining);
        lot.remainingPoints -= consumed;
        remaining -= consumed;
        await lot.save({ session });
      }
      // Members created before point lots existed still use the legacy scalar balance.
      if (remaining > 0 && lots.length === 0 && member.pointsBalance >= pointsNeeded) remaining = 0;
      if (remaining > 0) throw Object.assign(new Error('Insufficient unexpired points'), { status: 400 });
      member.pointsBalance -= pointsNeeded;
      member.updatedAt = redemptionTime;
      await member.save({ session });
      const redemption = new Redemption({ memberId, pointsRedeemed: pointsNeeded, itemName, timestamp: redemptionTime });
      await redemption.save({ session });
      return { member, redemption };
    });

    res.status(201).json({
      message: 'Redemption successful',
      itemName,
      pointsRedeemed: pointsNeeded,
      newBalance: result.member.pointsBalance,
      redemption: result.redemption
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
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
