# Wastify Deployment Guide

## Frontend (Next.js)
- Deploy on AWS Amplify
- Connect GitHub repo
- Set build commands: `npm install && npm run build && npm run export`
- Set environment variables for API endpoints and keys

## Backend (Node.js/Express)
- Deploy on AWS EC2
- SSH into EC2 instance
- Clone repo, install Node.js, npm, and dependencies
- Set environment variables for DB, JWT, Firebase, Twilio
- Use PM2 or similar to run server

## Database (PostgreSQL)
- Use AWS RDS PostgreSQL
- Run schema.sql to initialize
- Configure security groups for backend access

## Notifications
- Set up Firebase Cloud Messaging and Twilio credentials

See architecture.md for system overview.