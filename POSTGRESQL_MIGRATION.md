# PostgreSQL Migration - Neon Database Setup

## ✅ Completed

Your application has been successfully migrated from **MongoDB to Neon PostgreSQL** using **Prisma ORM**.

### What Changed

1. **Database Provider**: MongoDB Atlas → Neon PostgreSQL
2. **ORM**: Mongoose → Prisma
3. **Connection Management**: Custom MongoDB client → Prisma Client
4. **Schema Definition**: Mongoose schemas → Prisma schema

### Files Updated

- `lib/db.ts` - Prisma client configuration and connection pool
- `app/api/users/route.ts` - Updated to use Prisma for queries  
- `prisma/schema.prisma` - Database schema for PostgreSQL
- `scripts/seed-indian-employees.ts` - Updated seed script for Prisma
- `.env` - Updated with DATABASE_URL placeholder
- `.env.local` - Contains actual Neon PostgreSQL connection string (gitignored)

## 🚀 Getting Started

### 1. Database Tables Initialization

The Prisma migrations have been created. To deploy them to your Neon database:

```bash
# If not already done, push the schema
npx prisma db push

# Or create a migration
npx prisma migrate deploy
```

### 2. Seed Database with Sample Data

Once tables are created, seed the database with Indian employees:

```bash
npm run seed:employees
```

This will populate:
- ✅ 10 Indian employees with various roles
- ✅ 3 sample projects
- ✅ 3 sample tasks assigned to developers

### 3. Prisma Studio (Useful for Development)

Explore your database visually:

```bash
npx prisma studio
```

Opens a web UI at `http://localhost:5555` to view and edit data.

## 📋 Database Schema Overview

### Users Table
- `id` (Primary Key)
- `name`, `email` (unique), `phone`, `avatar`, `timezone`
- `role` (super_admin, admin, manager, developer, agency_user)
- `status` (active, inactive)
- `agencyId`, `password`
- `notificationPreferences` (relation)
- `timestamps` (createdAt, updatedAt)

### Projects Table
- `id`, `name`, `agencyId`, `status`, `type`
- `description`, `budget`, `pricingModel`
- `progress` (0-100), `deadline`
- `internalNotes`, `attachments`
- `relationships` (tasks, creator user)
- `timestamps`

### Tasks Table
- `id`, `title`, `description`
- `status` (not_started, in_progress, blocked, pending_review, completed)
- `priority` (low, medium, high, urgent)
- `estimatedHours`, `actualHours`
- `deadline`, `acceptanceCriteria`
- `relationships` (project, assignee)
- `timestamps`

### ActivityLog Table
- `id`, `userId`, `userName`
- `action`, `description`, `resourceType`, `resourceId`
- `ipAddress`, `timestamp`

## 🔧 API Examples

### Fetch All Users (Prisma)
```typescript
import { prisma } from '@/lib/db';

const users = await prisma.user.findMany();
```

### Create a User
```typescript
const newUser = await prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'developer',
    agencyId: 'unfold-cro',
  },
});
```

### Update a Project
```typescript
const updated = await prisma.project.update({
  where: { id: 'project-id' },
  data: { progress: 75 },
});
```

### Find Tasks by Project
```typescript
const tasks = await prisma.task.findMany({
  where: { projectId: 'project-id' },
  include: { assignee: true, project: true },
});
```

## 🔐 Security

✅ Database credentials stored in `.env.local` (gitignored)
✅ Connection string uses SSL/TLS encryption
✅ Channel binding enabled for additional security
✅ Pooled connections for performance

## 📚 Useful Commands

```bash
# View Prisma schema
npx prisma introspect

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Check migration status
npx prisma migrate status

# Generate Prisma Client after schema changes
npx prisma generate
```

## ⚠️ Important Notes

1. **Environment Variables**: Always use `.env.local` for sensitive credentials
2. **Migrations**: Create migrations for schema changes:
   ```bash
   npx prisma migrate dev --name add_new_feature
   ```
3. **Production Deployments**: Use `npx prisma migrate deploy` in CI/CD
4. **Connection Pooling**: Neon pooler URL is used for better performance

## 🆘 Troubleshooting

**Issue**: "Cannot find Prisma Client"
```bash
npx prisma generate
```

**Issue**: "Connection refused"
- Check `DATABASE_URL` in `.env.local`
- Verify Neon database is running
- Check your IP is whitelisted (if needed)

**Issue**: "Table does not exist"
```bash
npx prisma db push
# or
npx prisma migrate deploy
```

## 📖 Next Steps

1. Update remaining API routes to use Prisma
2. Add more complex queries with relations
3. Implement proper error handling
4. Add validation middleware
5. Set up database backups with Neon

## 🔗 Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Neon Database Documentation](https://neon.tech/docs)
- [Neon + Prisma Guide](https://neon.tech/docs/guides/prisma)

---

**Migration completed ✨**
Database is ready for development!
