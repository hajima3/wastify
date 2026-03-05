# Wastify Architecture

Wastify is a smart waste management platform for municipalities, contractors, and households. It features a Next.js frontend, Node.js/Express backend, PostgreSQL database, and integrations with Google Maps, Firebase, and Twilio.

## High-Level Architecture

- **Frontend:** Next.js, TailwindCSS, React Query/Axios, Mapbox/Google Maps, Chart.js/Recharts
- **Backend:** Node.js, Express.js REST API
- **Database:** PostgreSQL (AWS RDS)
- **Notifications:** Firebase Cloud Messaging, Twilio SMS
- **Deployment:** AWS EC2 (backend), AWS Amplify (frontend)

## User Roles
- Household User
- Municipal Administrator
- Waste Collection Contractor

## Core Features
- Waste tracking, reminders, route monitoring, rewards
- Role-based dashboards
- Analytics and reporting

## Diagram

![Architecture Diagram](architecture-diagram.png)

See deployment.md for cloud setup.