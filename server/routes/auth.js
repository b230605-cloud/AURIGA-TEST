import express from 'express';
import jwt from 'jsonwebtoken';
import Member from '../models/Member.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    if (!name || !email || !phoneNumber || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    let member = await Member.findOne({ $or: [{ email }, { phoneNumber }] });
    if (member) {
      return res.status(400).json({ error: 'Member already exists' });
    }

    member = new Member({ name, email, phoneNumber, password });
    await member.save();

    const token = generateToken(member._id);
    res.status(201).json({
      message: 'Member registered successfully',
      token,
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        phoneNumber: member.phoneNumber,
        pointsBalance: member.pointsBalance,
        tier: member.tier
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const member = await Member.findOne({ email });
    if (!member) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await member.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(member._id);
    res.json({
      message: 'Login successful',
      token,
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        phoneNumber: member.phoneNumber,
        pointsBalance: member.pointsBalance,
        tier: member.tier,
        totalPointsEarned: member.totalPointsEarned
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
