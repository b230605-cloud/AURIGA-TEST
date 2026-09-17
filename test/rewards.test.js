import test from 'node:test';
import assert from 'node:assert/strict';
import { multiplierForTier, pointsForPurchase, tierForLifetimePoints } from '../server/services/rewards.js';

const cases = [
  [0, 'Bronze'],
  [1999, 'Bronze'],
  [2000, 'Silver'],
  [4999, 'Silver'],
  [5000, 'Platinum']
];

test('tier thresholds preserve the legacy tiers and add Platinum at 5000', () => {
  for (const [lifetimePoints, expectedTier] of cases) {
    assert.equal(tierForLifetimePoints(lifetimePoints), expectedTier);
  }
});

test('legacy earning rates remain stable and Platinum earns at 1.8x', () => {
  assert.equal(pointsForPurchase(100, 'Bronze'), 1000);
  assert.equal(pointsForPurchase(100, 'Silver'), 1200);
  assert.equal(pointsForPurchase(100, 'Gold'), 1500);
  assert.equal(pointsForPurchase(100, 'Platinum'), 1800);
  assert.equal(multiplierForTier('Platinum'), 1.8);
});

test('purchase points are floored to whole points', () => {
  assert.equal(pointsForPurchase(12.55, 'Bronze'), 125);
  assert.equal(pointsForPurchase(12.55, 'Platinum'), 225);
});
