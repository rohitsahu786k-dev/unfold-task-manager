# MongoDB Integration - Complete Setup Guide

## 🎉 MongoDB Connection Successfully Configured!

Your UnfoldCRO application is now fully integrated with MongoDB. Follow the steps below to get started.

---

## 📋 What Was Set Up

### 1. ✅ Database Connection
- **File**: `lib/db.ts`
- **Connection**: MongoDB Atlas Cluster0
- **Features**: Connection pooling, caching, error handling
- **Status**: Connected and ready to use

### 2. ✅ Mongoose Models
- **File**: `lib/models.ts`
- **Models**: User, Project, Task, ActivityLog, Agency, Client, Contact, Meeting
- **Schema Validation**: Complete type safety with TypeScript

### 3. ✅ RESTful API Routes
- **Users**: `/api/users`, `/api/users/[id]`
- **Projects**: `/api/projects`
- **Tasks**: `/api/tasks`
- **Activity Logs**: `/api/activity-logs`
- **Health Check**: `/api/db-status`

### 4. ✅ Database Utilities
- **Service File**: `lib/db-service.ts` - Async functions for API calls
- **React Hooks**: `hooks/useDatabase.ts` - React hooks for data fetching
- **Initialization**: `lib/init-db.ts` - Auto-populate database with mock data

---

## 🚀 Quick Start Guide

### Step 1: Start the Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000`

### Step 2: Verify Database Connection
Check the database health:
```bash
curl http://localhost:3000/api/db-status
```

Expected response:
```json
{
  "status": "success",
  "message": "Connected to MongoDB",
  "database": "cluster0",
  "host": "cluster0.t4phqrk.mongodb.net",
  "timestamp": "2026-02-18T14:30:00.000Z"
}
```

### Step 3: Initialize Database
Populate the database with mock data:
```bash
curl http://localhost:3000/api/init-db
```

Or visit: `http://localhost:3000/api/init-db`

Expected response:
```json
{
  "message": "Database initialization completed",
  "status": "success"
}
```

### Step 4: Verify Data Population
```bash
curl http://localhost:3000/api/users
```

You should now see all users from the database.

---

## 🔌 Using the Database in Components

### Method 1: Using React Hooks (Recommended)
```typescript
'use client';

import { useUsers, useProjects, useTasks } from '@/hooks/useDatabase';

export default function MyComponent() {
  const { data: users, loading, error } = useUsers();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map(user => (
        <li key={user._id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Method 2: Using Database Service Functions
```typescript
import { fetchUsers, createUser, updateUser, deleteUser } from '@/lib/db-service';

// Fetch data
const users = await fetchUsers();

// Create new user
const newUser = await createUser({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'developer',
  status: 'active'
});

// Update user
await updateUser(userId, { name: 'Jane Doe' });

// Delete user
await deleteUser(userId);
```

### Method 3: Direct API Calls
```typescript
// Fetch
const response = await fetch('/api/users');
const users = await response.json();

// Create
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'developer'
  })
});
```

---

## 📊 Complete API Reference

### Users Endpoints

#### List All Users
```bash
GET /api/users
```
Response:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Sarah Chen",
    "email": "sarah@unfoldcro.com",
    "role": "super_admin",
    "status": "active",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

#### Create User
```bash
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0000",
  "role": "developer",
  "timezone": "EST",
  "status": "active"
}
```

#### Get User by ID
```bash
GET /api/users/507f1f77bcf86cd799439011
```

#### Update User
```bash
PUT /api/users/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "name": "Jane Doe",
  "role": "manager"
}
```

#### Delete User
```bash
DELETE /api/users/507f1f77bcf86cd799439011
```

### Projects Endpoints

#### List All Projects
```bash
GET /api/projects
```

#### Create Project
```bash
POST /api/projects
Content-Type: application/json

{
  "name": "New Website",
  "agency_id": "agency_1",
  "status": "in_progress",
  "budget": 5000,
  "deadline": "2026-03-18"
}
```

### Tasks Endpoints

#### List All Tasks
```bash
GET /api/tasks
```

#### Create Task
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Design Homepage",
  "project_id": "proj_1",
  "assigned_to": "user_4",
  "priority": "high",
  "deadline": "2026-02-25"
}
```

### Activity Logs Endpoints

#### List All Logs
```bash
GET /api/activity-logs
```

#### Create Log Entry
```bash
POST /api/activity-logs
Content-Type: application/json

{
  "user_id": "user_1",
  "user_name": "Sarah Chen",
  "action": "created",
  "description": "Created new project",
  "resource_type": "project",
  "resource_id": "proj_3"
}
```

### Health Check
```bash
GET /api/db-status
```

---

## 🛠️ Configuration Files

### `.env.local` (Secure - Not in Git)
```env
MONGODB_URI=mongodb+srv://rohitunfoldcro_db_user:cY3AwzBjO6fVNAUq@cluster0.t4phqrk.mongodb.net/?appName=Cluster0
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Connection (`lib/db.ts`)
- Implements caching to reuse connections
- Handles connection pooling
- Includes error handling and retry logic

### Models (`lib/models.ts`)
All Mongoose schemas are defined with proper types:
- User, Project, Task, ActivityLog
- Agency, Client, Contact, Meeting

---

## 🔐 Security Best Practices

### ✅ What We've Done
1. ✅ Credentials stored in `.env.local` (ignored by Git)
2. ✅ Connection pooling for performance
3. ✅ Server-side API routes for data access
4. ✅ TypeScript validation for data

### ⚠️ Additional Recommendations
1. **Rotate Password Regularly**
   - Change MongoDB password in Atlas every 30-90 days
   - Update `.env.local` after rotation

2. **Use Environment-Specific Credentials**
   - Development: Current credentials
   - Production: Create separate MongoDB user with limited permissions
   - Staging: Separate read-only user

3. **Enable IP Whitelisting**
   - MongoDB Atlas: Add only your server IPs
   - Remove 0.0.0.0/0 in production

4. **Monitor Access**
   - Check MongoDB Atlas activity log
   - Set up alerts for unusual access patterns

5. **API Route Protection** (Future)
   - Add authentication middleware
   - Validate user permissions for each endpoint
   - Rate limit API calls

---

## 📈 Monitoring & Debugging

### Check Database Status
```bash
curl http://localhost:3000/api/db-status
```

### View Logs in MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select Cluster0
3. Click "Logs"
4. View connection and operation logs

### Common Issues & Solutions

#### ❌ Connection Failed
```
Error: connect ECONNREFUSED
```
**Solution:**
- Verify MongoDB URI in `.env.local`
- Check cluster is running in MongoDB Atlas
- Whitelist your IP in MongoDB Atlas network access

#### ❌ Authentication Error
```
Error: invalid username [rohitunfoldcro_db_user]
```
**Solution:**
- Verify username and password are correct
- Check password doesn't contain special characters that need escaping
- Reset password in MongoDB Atlas if needed

#### ❌ Data Not Appearing
```
Empty array returned
```
**Solution:**
- Run `/api/init-db` to populate database
- Check MongoDB Atlas Collections tab
- Verify data was inserted successfully

---

## 📝 Next Steps

1. ✅ **MongoDB connected** - Ready to use
2. ✅ **API routes created** - Ready to call
3. ⏭️ **Initialize database** - Run `/api/init-db`
4. ⏭️ **Update components** - Replace mock data with API calls
5. ⏭️ **Add authentication** - Secure API routes
6. ⏭️ **Set up validation** - Add input validation
7. ⏭️ **Enable pagination** - Handle large datasets

---

## 🔗 Useful Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Environment Variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables)

---

## 📞 Support

For issues or questions:
1. Check this document for solutions
2. Verify `.env.local` is configured correctly
3. Check MongoDB Atlas connectivity
4. Review API response errors
5. Check browser console for frontend errors

---

## ✨ You're All Set!

Your MongoDB database is now integrated with UnfoldCRO. Start using it by:

```bash
npm run dev
curl http://localhost:3000/api/db-status
curl http://localhost:3000/api/init-db
```

Happy coding! 🚀
