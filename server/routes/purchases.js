import express from 'express';
import Member from '../models/Member.js';
import Purchase from '../models/Purchase.js';
import PointLot from '../models/PointLot.js';
import { NINETY_DAYS } from './clock.js';
import { pointsForPurchase, queueTierNotification, tierForLifetimePoints } from '../services/rewards.js';
import { runTransaction } from '../services/transaction.js';

const router = express.Router();

router.post('/record', async (req, res) => {
  try {
    const { memberId, amount, description } = req.body;

    if (!memberId || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: 'memberId and amount required' });
    }

    const purchaseTime = req.body.timestamp ? new Date(req.body.timestamp) : new Date();
    if (Number.isNaN(purchaseTime.getTime())) return res.status(400).json({ error: 'timestamp must be a valid date' });
    const result = await runTransaction(async (session) => {
      const member = await Member.findById(memberId).session(session);
      if (!member) throw Object.assign(new Error('Member not found'), { status: 404 });
      const fromTier = member.tier;
      const tierMultiplier = member.getTierMultiplier();
      const pointsAwarded = pointsForPurchase(Number(amount), member.tier);
      member.pointsBalance += pointsAwarded;
      member.totalPointsEarned += pointsAwarded;
      member.totalMoneySpent = (member.totalMoneySpent || 0) + Number(amount);
      member.updateTier();
      member.updatedAt = purchaseTime;
      await member.save({ session });
      const purchase = new Purchase({ memberId, amount: Number(amount), pointsAwarded, tierMultiplier, description, timestamp: purchaseTime });
      await purchase.save({ session });
      await PointLot.create([{ memberId, purchaseId: purchase._id, pointsAwarded, remainingPoints: pointsAwarded, earnedAt: purchaseTime, expiresAt: new Date(purchaseTime.getTime() + NINETY_DAYS) }], { session });
      await queueTierNotification(member, fromTier, tierForLifetimePoints(member.totalPointsEarned), purchaseTime, session);
      return { member, pointsAwarded, purchase };
    });

    res.status(201).json({
      message: 'Purchase recorded successfully',
      pointsAwarded: result.pointsAwarded,
      newBalance: result.member.pointsBalance,
      tier: result.member.tier,
      purchase: result.purchase
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
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
