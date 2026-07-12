# I MART

I MART is a Node.js + Express marketplace application.

## Quick start (development)

1. Copy `.env.example` to `.env` and fill in the values.
2. Install dependencies:

```bash
npm install
```

3. Run in dev mode:

```bash
npm run dev
```

## Docker

Build and run with Docker:

```bash
docker build -t i-mart .
docker run --env-file .env -p 5000:5000 i-mart
```

Or with docker-compose:

```bash
docker-compose up --build -d
```

## Production (PM2)

```bash
npm ci --only=production
npx pm2 start ecosystem.config.js
```

## CI

A GitHub Actions workflow is included at `.github/workflows/nodejs.yml`.

## Docker image publishing

A Docker publish workflow is included at `.github/workflows/docker-publish.yml`. It publishes the image to GitHub Container Registry as `ghcr.io/<OWNER>/i-mart:latest`.

## Deployment Guide

See `DEPLOYMENT.md` for staging deployment steps on Render, Heroku, and Docker.

## Notes

- Ensure `MONGODB_URI` and `JWT_SECRET` are set in production.
- Configure `PAYSTACK_SECRET_KEY` and `PAYSTACK_CALLBACK_URL` for payments.
