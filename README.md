# Backend

Express backend for the portfolio project.

## Scripts

- `npm run dev` starts the backend with `nodemon`
- `npm start` starts the backend with `node`

## Environment

Create `backend/.env` with the required values:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `CONTACT_RECEIVER_EMAIL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

## Routes

- `GET /` health message
- `GET /api/health`
- `POST /api/contact`
- `POST /api/auth/*`
