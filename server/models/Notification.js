import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  event: { type: String, required: true, default: 'tier.upgraded' },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true, index: true },
  memberEmail: String,
  memberPhone: String,
  fromTier: String,
  toTier: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true },
  deliveredAt: Date
});

export default mongoose.model('Notification', notificationSchema);
