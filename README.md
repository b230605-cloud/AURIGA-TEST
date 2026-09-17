# Café Chain Loyalty Points Rewards System

A full-stack application for managing a café's member loyalty program with tiered rewards, point earning, and redemption functionality.

## Features

- **Member Registration & Authentication**: Secure signup and login with JWT
- **Tiered Rewards System**: Bronze (1x), Silver (1.2x), Gold (1.5x) multipliers
- **Point Earning**: Earn 10 points per rupee with tier-based multipliers
- **Point Redemption**: Redeem points for free items
- **Member Search**: Search members by phone number (optimized with indexes)
- **Transaction History**: Complete purchase and redemption history with pagination
- **Live Balance Tracking**: Real-time points balance update
- **Admin Counter Panel**: Interface for staff to process purchases and redemptions

## Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: React 18 + Vite
- **Database**: MongoDB
- **Authentication**: JWT

## Setup & Installation

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### 1. Clone & Install Dependencies

```bash
npm install-all
```

This installs root dependencies and client dependencies.

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cafe-loyalty?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Run Development Servers

```bash
npm run dev
```

This starts both backend (port 5000) and frontend (port 5173) concurrently.

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Project Structure

```
café-loyalty-rewards/
├── server/
│   ├── models/
│   │   ├── Member.js
│   │   ├── Purchase.js
│   │   └── Redemption.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── members.js
│   │   ├── purchases.js
│   │   └── redemptions.js
│   ├── config/
│   │   └── db.js
│   └── server.js
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── CounterPanel.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── index.html
│   └── package.json
├── package.json
├── README.md
├── REASONING.md
└── AI_LOGS.md
```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new member |
| POST | `/login` | Login member |

**Register Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "9876543210",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "message": "Member registered successfully",
  "token": "jwt_token_here",
  "member": {
    "id": "member_id",
    "name": "John Doe",
    "email": "john@example.com",
    "pointsBalance": 0,
    "tier": "Bronze"
  }
}
```

### Member Routes (`/api/members`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all members (paginated) |
| GET | `/:id` | Get member by ID |
| GET | `/search?phoneNumber=9876543210` | Search member by phone |

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `sort` (default: -createdAt)

**Response:**
```json
{
  "members": [
    {
      "_id": "member_id",
      "name": "John Doe",
      "phoneNumber": "9876543210",
      "pointsBalance": 250,
      "tier": "Silver",
      "totalPointsEarned": 2500
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### Purchase Routes (`/api/purchases`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/record` | Record new purchase |
| GET | `/history/:memberId` | Get purchase history |

**Record Purchase Request:**
```json
{
  "memberId": "member_id",
  "amount": 100,
  "description": "Counter purchase"
}
```

**Response:**
```json
{
  "message": "Purchase recorded successfully",
  "pointsAwarded": 150,
  "newBalance": 400,
  "tier": "Silver",
  "purchase": {
    "_id": "purchase_id",
    "memberId": "member_id",
    "amount": 100,
    "pointsAwarded": 150,
    "tierMultiplier": 1.5
  }
}
```

### Redemption Routes (`/api/redemptions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/redeem` | Redeem points for item |
| GET | `/available-items` | Get available redemption items |
| GET | `/history/:memberId` | Get redemption history |

**Available Items:**
- Free Coffee (150 points)
- Free Pastry (100 points)
- Free Sandwich (250 points)
- Free Dessert (120 points)
- 10% Discount (80 points)
- Free Beverage (130 points)

**Redeem Request:**
```json
{
  "memberId": "member_id",
  "itemName": "Free Coffee"
}
```

**Response:**
```json
{
  "message": "Redemption successful",
  "itemName": "Free Coffee",
  "pointsRedeemed": 150,
  "newBalance": 250,
  "redemption": {
    "_id": "redemption_id",
    "memberId": "member_id",
    "pointsRedeemed": 150,
    "itemName": "Free Coffee"
  }
}
```

## Tier System

| Tier | Points Required | Multiplier | Benefits |
|------|-----------------|-----------|----------|
| Bronze | 0 - 1,999 | 1x | Base rewards |
| Silver | 2,000 - 4,999 | 1.2x | 20% bonus points |
| Gold | 5,000+ | 1.5x | 50% bonus points + VIP perks |

**Tier Upgrade Logic:**
- Tiers are automatically updated based on `totalPointsEarned`
- Member reaches Silver at 2,000 total points
- Member reaches Gold at 5,000 total points
- Tier multiplier is applied to each purchase

## Points Calculation Example

**Purchase: ₹100 by Silver Member**
- Base Points: 100 × 10 = 1,000 points
- Silver Multiplier: 1.2x
- Points Awarded: 1,000 × 1.2 = 1,200 points

## Database Schema

### Member
```javascript
{
  name: String,
  email: String (unique, indexed),
  phoneNumber: String (unique, indexed),
  password: String (hashed),
  pointsBalance: Number,
  tier: String (Bronze/Silver/Gold),
  totalPointsEarned: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Purchase
```javascript
{
  memberId: ObjectId (ref: Member, indexed),
  amount: Number,
  pointsAwarded: Number,
  tierMultiplier: Number,
  description: String,
  timestamp: Date
}
```

### Redemption
```javascript
{
  memberId: ObjectId (ref: Member, indexed),
  pointsRedeemed: Number,
  itemName: String,
  status: String (Completed/Pending/Cancelled),
  timestamp: Date
}
```

## Performance Optimizations

1. **Database Indexes**: Phone number search is indexed for fast lookups
2. **Pagination**: All member lists are paginated to handle large datasets
3. **JWT Auth**: Stateless authentication for scalability
4. **Efficient Queries**: Only necessary fields are fetched

## Error Handling

API returns appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Server Error

## Testing

### Test Register & Login
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phoneNumber": "9999999999",
    "password": "password123"
  }'
```

### Test Record Purchase
```bash
curl -X POST http://localhost:5000/api/purchases/record \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "memberId": "MEMBER_ID",
    "amount": 100,
    "description": "Test purchase"
  }'
```

### Test Redeem Points
```bash
curl -X POST http://localhost:5000/api/redemptions/redeem \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "memberId": "MEMBER_ID",
    "itemName": "Free Coffee"
  }'
```

## Deployment

### Build Frontend
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## License

MIT License - Use freely for educational and commercial purposes.

## Support

For issues or questions, please check the REASONING.md file for implementation details and decision rationale.
