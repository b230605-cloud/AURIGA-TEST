# Implementation Reasoning

## Correctness first

The system keeps a fast `pointsBalance` field and an auditable point-lot ledger. Each purchase creates a lot with earned time, remaining points, and a 90-day expiry. Redemptions consume the oldest unexpired lots first, while legacy members without lots can still use their existing scalar balance.

Purchases and redemptions run in MongoDB transactions. A purchase atomically updates the member, purchase record, point lot, and any tier-upgrade notification. A redemption atomically updates the member, consumes lots, and writes the redemption record.

## Tier compatibility

Bronze, Silver, and Gold remain supported. Platinum is selected at 5,000 lifetime earned points and uses the current required `1.8x` multiplier. Purchase points are calculated as `floor(amount * 10 * multiplier)`.

## Expiry and notifications

`POST /clock` accepts an optional `now` timestamp and expires all remaining lots whose expiry is reached. It writes expiry audit records and adjusts live balances. A tier transition creates a `tier.upgraded` notification event in the outbox, available through `/outbox` and `/api/outbox`.

## Security and operations

Private member, purchase, and redemption routes require JWT authentication. Authentication is rate-limited to 5 requests per 15 minutes, general API traffic to 100 requests per 15 minutes, and responses use compression. Environment secrets remain outside Git.

## Validation

- MongoDB integration flow passes for registration, login, purchase, Platinum calculation, redemption, tier notification, and expiry.
- Deterministic reward tests cover tier thresholds, multipliers, and rounding.
- Vite production build passes.
- Live smoke flow verified registration, a ₹100 Bronze purchase producing 1,000 points, and a 150-point redemption.
- Client runtime dependency audit reports zero vulnerabilities after the React Router upgrade.
