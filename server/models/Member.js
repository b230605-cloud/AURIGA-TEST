import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  pointsBalance: { type: Number, default: 0 },
  tier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze' },
  totalPointsEarned: { type: Number, default: 0 },
  totalMoneySpent: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

memberSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

memberSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

memberSchema.methods.getTierMultiplier = function() {
  const multipliers = { Bronze: 1, Silver: 1.2, Gold: 1.5, Platinum: 1.8 };
  return multipliers[this.tier];
};

memberSchema.methods.updateTier = function() {
  if (this.totalPointsEarned >= 5000) this.tier = 'Platinum';
  else if (this.totalPointsEarned >= 2000) this.tier = 'Silver';
  else this.tier = 'Bronze';
};

export default mongoose.model('Member', memberSchema);
