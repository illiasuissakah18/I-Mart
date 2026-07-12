# Deployment Guide for I MART

This guide covers staging deployment options for I MART using Docker, Render, or Heroku.

## 1. Prepare the app

1. Copy `.env.example` to `.env`.
2. Fill in the values:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PAYSTACK_SECRET_KEY`
   - `PAYSTACK_CALLBACK_URL`
   - `CORS_ORIGINS`
3. Make sure `server.js` and `config/database.js` are configured for production.

## 2. Deploy with Render

Render is a good staging platform for Node apps with MongoDB.

### Create a Web Service

1. Sign in to Render.
2. Create a new **Web Service**.
3. Connect to the GitHub repo `illiasuissakah18/I-Mart`.
4. Set the build command:

```bash
npm install
```

5. Set the start command:

```bash
npm start
```

6. Set environment variables in Render:

- `MONGODB_URI`
- `JWT_SECRET`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_CALLBACK_URL`
- `CORS_ORIGINS`
- `PORT` (optional, Render sets its own PORT automatically)
- `NODE_ENV=production`

### Use MongoDB Atlas

- Create a free MongoDB Atlas cluster.
- Set `MONGODB_URI` to the Atlas connection string.
- Ensure the Atlas IP whitelist includes Render's outbound IPs or use `0.0.0.0/0` for staging.

## 3. Deploy with Heroku

This app includes a `Procfile` and works with Heroku.

### Create an app

1. Install the Heroku CLI.
2. Run:

```bash
heroku create i-mart-staging
```

3. Add required config vars:

```bash
heroku config:set \
  MONGODB_URI="your_mongo_uri" \
  JWT_SECRET="your_jwt_secret" \
  PAYSTACK_SECRET_KEY="your_paystack_secret" \
  PAYSTACK_CALLBACK_URL="https://your-app.herokuapp.com/api/payment/webhook" \
  CORS_ORIGINS="https://your-app.herokuapp.com"
```

4. Deploy code:

```bash
git push heroku main
```

5. Open the app:

```bash
heroku open
```

## 4. Docker staging environment

Use the included Docker setup for local or cloud staging.

### Build locally

```bash
docker build -t i-mart .
```

### Run locally with env file

```bash
docker run --env-file .env -p 5000:5000 i-mart
```

### Use docker-compose

```bash
docker-compose up --build -d
```

## 5. Paystack webhook setup

1. In Paystack dashboard, add your webhook URL.
2. Use the same URL as `PAYSTACK_CALLBACK_URL`.
3. For staging, set it to either:
   - `https://your-render-app.onrender.com/api/payment/webhook`
   - `https://your-app.herokuapp.com/api/payment/webhook`

## 6. Staging checklist

- [ ] Environment variables configured
- [ ] MongoDB reachable from the platform
- [ ] Payment webhook URL registered in Paystack
- [ ] `NODE_ENV=production`
- [ ] App responds at `/`
- [ ] Static files load from `/uploads`
- [ ] API routes accessible behind `/api`
