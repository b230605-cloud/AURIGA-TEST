import mongoose from 'mongoose';

const pointLotSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true, index: true },
  purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase', required: true },
  pointsAwarded: { type: Number, required: true, min: 0 },
  remainingPoints: { type: Number, required: true, min: 0 },
  earnedAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true, index: true },
  expiredAt: Date
}, { timestamps: true });

pointLotSchema.index({ memberId: 1, earnedAt: 1 });

export default mongoose.model('PointLot', pointLotSchema);
