import mongoose from 'mongoose';

const redemptionSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  pointsRedeemed: { type: Number, required: true },
  itemName: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Completed' },
  timestamp: { type: Date, default: Date.now }
});

redemptionSchema.index({ memberId: 1, timestamp: -1 });

export default mongoose.model('Redemption', redemptionSchema);
