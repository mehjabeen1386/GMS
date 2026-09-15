# Garment ERP (GMS)

Garment ERP is a full-stack operations platform for garment contractors and manufacturing workshops. It manages buyers, fabric inventory, job orders, production activity, workers, piece-rate balances, reports, and factory settings from one live, API-driven workspace.

## Features

- Live dashboard metrics for active orders, workforce, inventory, and payouts
- Buyer and client management
- Fabric roll inventory with stock tracking
- Job order creation, progress tracking, soft deletion, and recovery
- Production floor scan records and piece-rate monitoring
- Worker directory and payout reporting
- CSV reports and operational analytics
- JWT authentication and role-aware backend routes
- Responsive Next.js interface with refreshable live data

## Tech Stack

### Frontend

- Next.js 14 App Router
- React and TypeScript
- Tailwind CSS
- Axios
- Zustand
- Zod
- Lucide React

### Backend

- Node.js and Express
- MongoDB with Mongoose
- JWT authentication
- Socket.IO
- Helmet, CORS, rate limiting, and request validation

## Repository Structure

```text
GMS/
├── frontend/       # Next.js web application
├── backend/        # Express REST API and Socket.IO server
├── docs/           # API and architecture documentation
├── docker-compose.yml
└── vercel.json
```

## Requirements

- Node.js 18 or newer
- npm 9 or newer
- MongoDB running locally or a MongoDB Atlas connection

## Local Setup

Clone the repository:

```bash
git clone https://github.com/mehjabeen1386/GMS.git
cd GMS
```

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Create the backend environment file:

```bash
cd ../backend
copy .env.example .env    # Windows
# cp .env.example .env   # macOS/Linux
```

Set at least these backend values in `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/garment_db
JWT_SECRET=replace-with-a-long-random-secret
JWT_REFRESH_SECRET=replace-with-another-long-random-secret
CORS_ORIGIN=http://localhost:3000
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run the backend and frontend in separate terminals:

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The API health check is available at [http://localhost:5000/health](http://localhost:5000/health).

## Useful Commands

```bash
# Frontend
cd frontend
npm run dev
npm run build
npm run type-check

# Backend
cd backend
npm run dev
npm run build
npm test
```

## Deployment

- **Frontend:** deployed through Vercel from the `frontend` project directory
- **Backend:** deployed as the Render web service
- Configure `NEXT_PUBLIC_API_URL` in Vercel with the deployed backend URL.
- Configure `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `CORS_ORIGIN` in Render.
- Never commit `.env`, `.env.local`, JWT secrets, database credentials, or API keys.

## Main Routes

| Area | Route |
| --- | --- |
| Login | `/login` |
| Dashboard | `/dashboard` |
| Buyers | `/buyers` |
| Inventory | `/inventory` |
| Orders | `/orders` |
| Production | `/production` |
| Reports | `/reports` |
| Workers | `/workers` |
| Settings | `/settings` |

## License

Copyright © 2026 AI Powered Garments Contractor and Worker Management System. All rights reserved. This repository is shared for portfolio and demonstration purposes only.
