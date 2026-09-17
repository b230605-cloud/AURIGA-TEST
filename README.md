# Café Rewards

A full-stack café loyalty rewards system for staff and members. Staff can look up members, record purchases, award tier-aware points, redeem rewards, and inspect a live balance. Members can view their tier and reward history.

## Stack

- React 18 + Vite
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs authentication
- Express rate limiting and response compression

## Setup

Requirements: Node.js 18+ and MongoDB 6+ (local or Atlas).

```bash
cp .env.example .env
npm install
npm install --prefix client
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:5000`.

For a production frontend build:

```bash
npm run build
npm start
```

## Reward rules

- Bronze: below 2,000 lifetime earned points, `1x` legacy earn rate.
- Silver: 2,000-4,999 lifetime earned points, `1.2x` legacy earn rate.
- Platinum: 5,000+ lifetime earned points, `1.8x` earn multiplier.
- Gold remains in the schema for backward compatibility with existing records.
- Points are whole numbers and are floored after calculation.
- New purchase points are stored in lots and expire after 90 days if unused.
- Redemptions consume the oldest unexpired lots first.
- A tier upgrade creates a `tier.upgraded` event in the notification outbox.

## API endpoints

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`

Members:

- `GET /api/members`
- `GET /api/members/search?phoneNumber=...&page=1&limit=10`
- `GET /api/members/:id`

Counter:

- `POST /api/purchases/record`
- `GET /api/purchases/history/:memberId`
- `GET /api/redemptions/available-items`
- `POST /api/redemptions/redeem`
- `GET /api/redemptions/history/:memberId`

Twists:

- `POST /clock` or `POST /api/clock` with `{ "now": "2026-12-20T00:00:00.000Z" }`
- `GET /outbox` or `GET /api/outbox`
- `GET /api/health`

## Testing

```bash
npm test
```

The tests cover tier boundaries, backward-compatible earning rates, Platinum earning, and whole-point rounding. Run the UI build with `npm run build`.

## Security and reliability

Authentication endpoints have a stricter rate limit, API requests have a general rate limit, and responses are compressed. Purchase, redemption, point-lot, and tier-notification writes run inside MongoDB transactions, so the live balance cannot be committed without the matching ledger records. Use MongoDB Atlas or a replica-set-enabled local MongoDB for transaction support.
