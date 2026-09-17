# AURIGA Cafe Rewards System

A full-stack cafe loyalty rewards system for the AURIGA recruitment challenge. Members earn points on purchases, unlock tiers, redeem rewards, and receive tier-upgrade notifications. Staff can look up members by phone, record purchases, and manage redemptions.

## Features

- React 18 + Vite frontend with landing, login, signup, dashboard, counter, admin, and profile pages
- Express REST API with MongoDB and Mongoose
- JWT authentication with bcrypt password hashing
- Tier-aware points: Bronze `1x`, Silver `1.2x`, Gold `1.5x`, Platinum `1.8x`
- 90-day point-lot expiry through `POST /clock`
- Atomic MongoDB transactions for purchases and redemptions
- Tier-upgrade notification outbox through `GET /outbox`
- Phone lookup, pagination, sorting, responsive UI, loading states, and error states
- API compression and rate limiting

## Setup

Requirements: Node.js 18+ and MongoDB 6+ with replica-set transactions enabled. MongoDB Atlas works.

```bash
git clone https://github.com/b230605-cloud/AURIGA-TEST.git
cd AURIGA-TEST
cp .env.example .env
npm ci
npm ci --prefix client
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:5000`.

Run services separately when debugging:

```bash
# Terminal 1
npm run server:dev

# Terminal 2
npm run client:dev
```

## Environment variables

Copy `.env.example` to `.env` and set `PORT`, `CLIENT_URL`, `MONGODB_URI`, and a long random `JWT_SECRET`. Never commit `.env` or expose `JWT_SECRET`.

## Reward rules

- Bronze: below 2,000 lifetime earned points, `1x`
- Silver: 2,000-4,999 lifetime earned points, `1.2x`
- Gold: retained for backward compatibility with existing records, `1.5x`
- Platinum: 5,000+ lifetime earned points, `1.8x`
- Purchase points are `floor(amount * 10 * currentTierMultiplier)`.
- Each purchase creates a point lot that expires 90 days after earning if unused.
- Redemptions consume the oldest unexpired point lots first.
- Tier upgrades create a `tier.upgraded` event in the outbox.

## Commands

```bash
npm test       # reward and MongoDB integration tests
npm run build  # production frontend build
npm start      # start the API
```

`npm test` runs the complete flow when `MONGODB_URI` is configured. Without MongoDB, deterministic reward tests still run and the integration test is skipped.

## Deployment

1. Create a MongoDB Atlas cluster with replica-set transactions enabled.
2. Set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, and `PORT` in the deployment environment.
3. Run `npm ci` and `npm ci --prefix client`.
4. Build with `npm run build`.
5. Start the API with `npm start`.
6. Serve `client/dist` through a static host or reverse proxy. If frontend and API use different origins, set `VITE_API_URL` before the client build.

## API summary

Authentication: `POST /api/auth/register`, `POST /api/auth/login`

Members: `GET /api/members`, `GET /api/members/search`, `GET /api/members/:id`

Counter: `POST /api/purchases/record`, `GET /api/purchases/history/:memberId`, `GET /api/redemptions/available-items`, `POST /api/redemptions/redeem`, `GET /api/redemptions/history/:memberId`

Automation: `POST /clock` or `/api/clock`, `GET /outbox` or `/api/outbox`, `GET /api/health`

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for request examples and response behavior.
