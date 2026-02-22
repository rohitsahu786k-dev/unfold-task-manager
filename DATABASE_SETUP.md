# Neon Database Setup Guide

This project uses Neon PostgreSQL via Prisma. MongoDB is no longer used.

## 1. Required environment variable

Create `.env.local` with:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
```

Use the pooled connection string from your Neon project.

## 2. Install dependencies

```bash
npm install
```

## 3. Sync Prisma schema to Neon

```bash
npx prisma db push
```

## 4. Seed sample data (optional)

```bash
npm run seed
```

## 5. Validate connection

Start the app:

```bash
npm run dev
```

Then check:

```bash
curl http://localhost:3000/api/db-status
```

Expected response includes:

- `status: "success"`
- `message: "Connected to Neon PostgreSQL"`

## 6. Useful Prisma commands

```bash
npx prisma generate
npx prisma studio
npx prisma migrate reset
```

## Notes

- Keep `.env.local` out of Git.
- Rotate Neon credentials if they were ever exposed.
- For production, store `DATABASE_URL` in your deployment platform secrets.
