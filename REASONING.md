# Implementation reasoning

## Correctness first

The balance is stored for fast reads, while each purchase also creates a point lot. A lot tracks the earned points, remaining points, earned time, and 90-day expiry. A redemption consumes the oldest unexpired lots first. This keeps the live balance and expiry behavior explainable.

Purchase, redemption, point-lot, and tier-notification writes are grouped in MongoDB transactions. If any write fails, the balance update is rolled back with its corresponding ledger record.

## Tier compatibility

Bronze, Silver, and Gold earning behavior remains unchanged. Platinum is selected at 5,000 lifetime points and earns at a 1.8x multiplier. Gold remains accepted in the schema so existing Gold documents remain readable.

## Notification integration

A tier upgrade produces a `tier.upgraded` outbox event containing the member identity and both tier values. The outbox is exposed through `/outbox` and `/api/outbox`, which makes the event available to a separate notification worker.

## Testing

Automated tests cover tier boundaries, legacy rates, Platinum calculation, and integer rounding. Backend files are syntax-checked and the React client is built with Vite. Full purchase, redemption, expiry, and outbox integration testing requires a running MongoDB replica set or MongoDB Atlas connection.
