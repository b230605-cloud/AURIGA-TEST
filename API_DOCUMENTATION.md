# Café Rewards API

Base URL: `http://localhost:5000`

Protected requests use `Authorization: Bearer <jwt>`.

## Health

### `GET /api/health`

Returns API status and server time.

## Authentication

### `POST /api/auth/register`

```json
{
  "name": "Asha Sharma",
  "email": "asha@example.com",
  "phoneNumber": "9876543210",
  "password": "secret123"
}
```

### `POST /api/auth/login`

```json
{
  "email": "asha@example.com",
  "password": "secret123"
}
```

Auth endpoints are limited to 5 requests per 15 minutes per client.

## Members

### `GET /api/members?page=1&limit=10&sort=-createdAt`

Returns a paginated member list. Supported sort values include `createdAt`, `-createdAt`, `name`, and `-name`.

### `GET /api/members/search?phoneNumber=987&page=1&limit=10`

Looks up members by a partial phone number with pagination.

### `GET /api/members/:id`

Returns a member's current balance, lifetime earned points, and tier.

## Purchases

### `POST /api/purchases/record`

```json
{
  "memberId": "64f...",
  "amount": 100,
  "description": "Cappuccino",
  "timestamp": "2026-09-17T10:00:00.000Z"
}
```

Points are `floor(amount * 10 * tierMultiplier)`. Multipliers: Bronze `1x`, Silver `1.2x`, Gold `1.5x`, Platinum `1.8x`. Purchase, point lot, member balance, and tier notification are committed in one MongoDB transaction.

### `GET /api/purchases/history/:memberId?page=1&limit=10`

Returns paginated purchase history.

## Redemptions

### `GET /api/redemptions/available-items`

Returns the reward catalog and point costs.

### `POST /api/redemptions/redeem`

```json
{
  "memberId": "64f...",
  "itemName": "Free Coffee",
  "timestamp": "2026-09-17T11:00:00.000Z"
}
```

Redemption consumes the oldest unexpired point lots first and writes the member balance and redemption record atomically.

### `GET /api/redemptions/history/:memberId?page=1&limit=10`

Returns paginated redemption history.

## Automation and integration

### `POST /clock` or `POST /api/clock`

Expires all remaining lots whose 90-day expiry is at or before the supplied clock value.

```json
{ "now": "2026-12-20T00:00:00.000Z" }
```

### `GET /outbox` or `GET /api/outbox`

Returns queued `tier.upgraded` notification events. Use `?since=<ISO-date>` and `?limit=100` for polling.

## Operational middleware

- Compression is enabled with `compression()`.
- General API traffic is limited to 100 requests per 15 minutes.
- Authentication traffic is limited to 5 requests per 15 minutes.
- MongoDB transactions require a replica set or MongoDB Atlas.
