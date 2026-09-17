import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Member from '../models/Member.js';
import Purchase from '../models/Purchase.js';
import Redemption from '../models/Redemption.js';
import PointExpiry from '../models/PointExpiry.js';
import Notification from '../models/Notification.js';
import app from '../../server.js';

const integrationEnabled = Boolean(process.env.MONGODB_URI);
const email = `flow-${Date.now()}@example.com`;
let member;
let token;
const createdMemberIds = [];

before(async () => {
  if (!integrationEnabled) return;
  await connectDB();
});

after(async () => {
  if (integrationEnabled) {
    await Promise.all([
      Purchase.deleteMany({ memberId: { $in: createdMemberIds } }),
      Redemption.deleteMany({ memberId: { $in: createdMemberIds } }),
      PointExpiry.deleteMany({ memberId: { $in: createdMemberIds } }),
      Notification.deleteMany({ memberId: { $in: createdMemberIds } }),
      Member.deleteMany({ _id: { $in: createdMemberIds } })
    ]);
    await mongoose.disconnect();
  }
});

test('complete rewards flow works with transactions, expiry, and outbox notifications', { skip: !integrationEnabled }, async () => {
  await request(app).get('/api/members').expect(401);
  const register = await request(app).post('/api/auth/register').send({ name: 'Flow Tester', email, phoneNumber: `9${Date.now()}`, password: 'secret123' }).expect(201);
  assert.ok(register.body.token);
  member = register.body.member;
  createdMemberIds.push(member.id);

  const login = await request(app).post('/api/auth/login').send({ email, password: 'secret123' }).expect(200);
  token = login.body.token;
  assert.equal(login.body.member.tier, 'Bronze');

  const purchase = await request(app).post('/api/purchases/record').set('Authorization', `Bearer ${token}`).send({ memberId: member.id, amount: 100 }).expect(201);
  assert.equal(purchase.body.pointsAwarded, 1000);
  assert.equal(purchase.body.newBalance, 1000);
  const savedAfterPurchase = await Member.findById(member.id);
  assert.equal(savedAfterPurchase.totalMoneySpent, 100);

  await Member.findByIdAndUpdate(member.id, { tier: 'Platinum', totalPointsEarned: 5000, pointsBalance: 1000 });
  const platinumPurchase = await request(app).post('/api/purchases/record').set('Authorization', `Bearer ${token}`).send({ memberId: member.id, amount: 100 }).expect(201);
  assert.equal(platinumPurchase.body.pointsAwarded, 1800);
  assert.equal(platinumPurchase.body.newBalance, 2800);

  const redemption = await request(app).post('/api/redemptions/redeem').set('Authorization', `Bearer ${token}`).send({ memberId: member.id, itemName: 'Free Coffee' }).expect(201);
  assert.equal(redemption.body.pointsRedeemed, 150);
  assert.equal(redemption.body.newBalance, 2650);

  const tierMember = await Member.findOneAndUpdate({ email }, { tier: 'Gold', totalPointsEarned: 4990 }, { new: true });
  assert.ok(tierMember);
  await request(app).post('/api/purchases/record').set('Authorization', `Bearer ${token}`).send({ memberId: member.id, amount: 1 }).expect(201);
  const outbox = await request(app).get('/outbox').expect(200);
  assert.ok(outbox.body.events.some((event) => event.event === 'tier.upgraded' && event.toTier === 'Platinum'));

  const expiryEmail = `expiry-${Date.now()}@example.com`;
  const expiryRegister = await request(app).post('/api/auth/register').send({ name: 'Expiry Tester', email: expiryEmail, phoneNumber: `8${Date.now()}`, password: 'secret123' }).expect(201);
  createdMemberIds.push(expiryRegister.body.member.id);
  const earnedAt = new Date('2026-01-01T00:00:00.000Z');
  await request(app).post('/api/purchases/record').set('Authorization', `Bearer ${expiryRegister.body.token}`).send({ memberId: expiryRegister.body.member.id, amount: 100, timestamp: earnedAt.toISOString() }).expect(201);
  const clock = await request(app).post('/clock').send({ now: '2026-04-15T00:00:00.000Z' }).expect(200);
  assert.ok(clock.body.pointsExpired >= 1000);
  const expiredMember = await Member.findById(expiryRegister.body.member.id);
  assert.equal(expiredMember.pointsBalance, 0);
});

test('the integration suite explains how to run when MongoDB is unavailable', { skip: integrationEnabled }, () => {
  assert.ok(!process.env.MONGODB_URI, 'Set MONGODB_URI to run complete-flow.test.js against MongoDB');
});
