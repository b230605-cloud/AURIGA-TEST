import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  amount: { type: Number, required: true },
  pointsAwarded: { type: Number, required: true },
  tierMultiplier: { type: Number, required: true },
  description: String,
  timestamp: { type: Date, default: Date.now }
});

purchaseSchema.index({ memberId: 1, timestamp: -1 });

export default mongoose.model('Purchase', purchaseSchema);
