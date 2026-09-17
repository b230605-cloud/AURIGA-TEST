import express from 'express';
import Member from '../models/Member.js';
import PointExpiry from '../models/PointExpiry.js';
import PointLot from '../models/PointLot.js';

const router = express.Router();
const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;

export async function expireStalePoints(now = new Date()) {
  const cutoff = new Date(now);
  const lots = await PointLot.find({ expiresAt: { $lte: cutoff }, remainingPoints: { $gt: 0 } }).sort({ expiresAt: 1, earnedAt: 1 });
  const byMember = new Map();
  for (const lot of lots) {
    const points = lot.remainingPoints;
    lot.remainingPoints = 0;
    lot.expiredAt = cutoff;
    await lot.save();
    const key = String(lot.memberId);
    const current = byMember.get(key) || { points: 0, lotIds: [], memberId: lot.memberId };
    current.points += points;
    current.lotIds.push(lot._id);
    byMember.set(key, current);
  }
  const expiries = [];
  for (const { memberId, points, lotIds } of byMember.values()) {
    const member = await Member.findByIdAndUpdate(memberId, { $inc: { pointsBalance: -points }, $set: { updatedAt: cutoff } }, { new: true });
    if (!member) continue;
    // Guard against legacy/manual data: a stale lot can never make the live balance negative.
    if (member.pointsBalance < 0) {
      member.pointsBalance = 0;
      await member.save();
    }
    expiries.push(await PointExpiry.create({ memberId, pointsExpired: points, expiredAt: cutoff, sourceLotIds: lotIds }));
  }
  return { now: cutoff, expiredLots: lots.length, pointsExpired: expiries.reduce((sum, entry) => sum + entry.pointsExpired, 0), membersAffected: expiries.length };
}

router.post('/', async (req, res) => {
  try {
    const now = req.body?.now ? new Date(req.body.now) : new Date();
    if (Number.isNaN(now.getTime())) return res.status(400).json({ error: 'now must be a valid date' });
    res.json(await expireStalePoints(now));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { NINETY_DAYS };
export default router;
