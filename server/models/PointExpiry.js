import mongoose from 'mongoose';

const pointExpirySchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true, index: true },
  pointsExpired: { type: Number, required: true, min: 1 },
  expiredAt: { type: Date, required: true, index: true },
  sourceLotIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PointLot' }]
}, { timestamps: true });

export default mongoose.model('PointExpiry', pointExpirySchema);
