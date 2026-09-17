import Notification from '../models/Notification.js';

export const TIER_RANK = { Bronze: 0, Silver: 1, Gold: 2, Platinum: 3 };

export function tierForLifetimePoints(totalPointsEarned) {
  if (totalPointsEarned >= 5000) return 'Platinum';
  if (totalPointsEarned >= 2000) return 'Silver';
  return 'Bronze';
}

export function multiplierForTier(tier) {
  return { Bronze: 1, Silver: 1.2, Gold: 1.5, Platinum: 1.8 }[tier] || 1;
}

export function pointsForPurchase(amount, tier) {
  return Math.floor(Math.floor(amount * 10) * multiplierForTier(tier));
}

export async function queueTierNotification(member, fromTier, toTier, timestamp = new Date(), session) {
  if ((TIER_RANK[toTier] ?? 0) <= (TIER_RANK[fromTier] ?? 0)) return null;
  const event = { event: 'tier.upgraded', memberId: member._id, memberEmail: member.email, memberPhone: member.phoneNumber, fromTier, toTier, createdAt: timestamp };
  if (session) {
    const [notification] = await Notification.create([event], { session });
    return notification;
  }
  return Notification.create(event);
}
