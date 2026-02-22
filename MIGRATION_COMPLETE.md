# Neon Migration Complete

## Status

Migration to Neon PostgreSQL is complete. The application now uses Prisma + Neon only.

## What is now active

- Prisma client in `lib/db.ts`
- PostgreSQL datasource in `prisma/schema.prisma`
- API routes using Prisma queries under `app/api/*`
- Database health endpoint: `app/api/db-status/route.ts`

## What was removed

- MongoDB integration docs
- Legacy Mongoose model file (`lib/models.ts`)
- `mongoose` package dependency

## Required environment variable

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
```

## Verification checklist

1. Install dependencies:
   ```bash
   npm install
   ```
2. Push schema:
   ```bash
   npx prisma db push
   ```
3. Start app:
   ```bash
   npm run dev
   ```
4. Validate DB connection:
   ```bash
   curl http://localhost:3000/api/db-status
   ```
5. Optional seed:
   ```bash
   npm run seed
   ```
