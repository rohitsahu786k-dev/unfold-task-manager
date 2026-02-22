# PostgreSQL and Neon Guide

This project runs on Neon PostgreSQL with Prisma.

## Required env

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
```

## Core workflow

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## Seed and inspect

```bash
npm run seed
npx prisma studio
```

## Troubleshooting

1. Ensure `DATABASE_URL` is set in `.env.local`.
2. Check Neon project status in the Neon dashboard.
3. Re-generate Prisma client:
   ```bash
   npx prisma generate
   ```
4. Re-sync schema:
   ```bash
   npx prisma db push
   ```
