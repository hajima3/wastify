# Wastify - Copilot Instructions

## Project Overview
Wastify is a full-stack smart waste management platform built with Next.js (frontend) and Express.js (backend) with PostgreSQL.

## Tech Stack
- **Frontend**: Next.js, React 18, TailwindCSS, Axios, Chart.js, react-chartjs-2
- **Backend**: Express.js, PostgreSQL (pg), JWT, bcryptjs
- **Security**: helmet, xss-clean, express-rate-limit, express-validator

## Project Structure
- `frontend/` — Next.js app (pages, components, layouts, hooks, services)
- `backend/` — Express.js API (routes, middleware, models)
- `database/` — PostgreSQL schema and seed data
- `docs/` — Architecture and API documentation

## Development
- Backend runs on port 4000 (`cd backend && npm run dev`)
- Frontend runs on port 3000 (`cd frontend && npm run dev`)
- Database: PostgreSQL with schema in `database/schema.sql`

## Conventions
- Use TailwindCSS utility classes with green color theme
- API calls go through `frontend/services/api.js` (Axios with JWT interceptor)
- Auth state managed via `frontend/hooks/useAuth.js` (React Context)
- Backend routes use `authenticateToken` and `authorizeRoles` middleware
- All database queries use parameterized queries (prevent SQL injection)

## Roles
- `household` — End users who report pickups, view schedules, earn rewards
- `admin` — Municipal administrators who manage schedules, routes, analytics
- `contractor` — Waste collection contractors who view assigned routes
