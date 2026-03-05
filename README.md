# Wastify

Smart Waste Management Platform for Cities

## Features
- **Missed Pickup Reporting** — Households report missed collections; admins track/resolve
- **Waste Segregation Guide** — Searchable guide with categories (Biodegradable, Recyclable, Hazardous, Residual)
- **Route Monitoring** — View and manage garbage truck routes and areas
- **Analytics Dashboard** — Chart.js-powered bar & doughnut charts for pickup stats and user metrics
- **Reward System** — Earn and redeem points for waste compliance
- **Notifications** — Firebase Cloud Messaging & Twilio SMS (integration ready)
- **Role-Based Access** — Household, Municipal Admin, Contractor roles with JWT auth

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (React 18), TailwindCSS, Axios, Chart.js, react-chartjs-2 |
| Backend | Express.js 4.18, PostgreSQL, JWT, bcryptjs |
| Security | helmet, xss-clean, express-rate-limit, express-validator |
| Notifications | firebase-admin, twilio (packages installed) |
| Maps | mapbox-gl (token required) |

## Quick Start

### 1. Database
```bash
# Create a PostgreSQL database, then run:
psql -U postgres -d wastify -f database/schema.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env   # edit with your DB credentials & JWT secret
npm install
npm run dev             # starts on http://localhost:4000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev             # starts on http://localhost:3000
```

### Environment Variables (backend `.env`)
```
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=wastify
JWT_SECRET=your_jwt_secret
```

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /auth/register | — | Register user |
| POST | /auth/login | — | Login, get JWT |
| GET | /household/dashboard | household | Dashboard data |
| GET | /household/schedule | household | Collection schedule |
| POST | /household/report-missed | household | Report missed pickup |
| POST | /household/profile | household | Create/update profile |
| GET | /admin/analytics | admin | Aggregate stats |
| CRUD | /admin/schedule | admin | Manage schedules |
| CRUD | /admin/routes | admin | Manage routes |
| GET/PUT | /admin/missed-pickups | admin | View/resolve reports |
| POST | /admin/notify | admin | Send notifications |
| GET | /rewards | household | Points & history |
| POST | /rewards/earn | household | Earn points |
| POST | /rewards/redeem | household | Redeem points |
| GET | /notifications | auth | List notifications |
| DELETE | /notifications/:id | auth | Delete notification |
| GET | /waste-guide/categories | — | Waste categories |
| GET | /waste-guide/items | — | Search waste items |

## Project Structure
```
wastify/
├── backend/           # Express.js API
│   ├── routes/        # auth, household, admin, rewards, notifications, wasteGuide
│   ├── middleware/     # auth, rateLimit, helmet, sanitize, validate
│   ├── models/        # db.js (PostgreSQL pool)
│   └── index.js       # Server entry
├── frontend/          # Next.js app
│   ├── pages/         # login, register, dashboards, rewards, analytics, guide, map
│   ├── components/    # Navbar, Footer
│   ├── layouts/       # MainLayout
│   ├── hooks/         # useAuth (AuthContext)
│   └── services/      # api.js (Axios)
├── database/          # schema.sql
└── docs/              # Architecture, API spec, deployment guide
```

## License
MIT