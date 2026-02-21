# MongoDB Database Setup Guide

## ✅ Setup Complete!

Your UnfoldCRO application is now connected to MongoDB. Here's what was set up:

### 1. **Environment Configuration**
- Created `.env.local` with your MongoDB connection string
- Connection: `mongodb+srv://rohitunfoldcro_db_user:***@cluster0.t4phqrk.mongodb.net`
- This file is **automatically ignored by Git** for security

### 2. **Database Connection**
- Installed Mongoose ODM for MongoDB
- Created connection pooling in `lib/db.ts`
- Implements connection caching for optimal performance

### 3. **Database Models**
The following models are now available in `lib/models.ts`:
- **User** - System users with roles and permissions
- **Project** - Project management with status tracking
- **Task** - Task assignments and tracking
- **ActivityLog** - User action auditing
- **Agency** - External agency management
- **Client** - Client information
- **Contact** - Contact management
- **Meeting** - Meeting scheduling

### 4. **API Routes**
RESTful API endpoints have been created:

#### Users
```
GET    /api/users              - List all users
POST   /api/users              - Create new user
GET    /api/users/[id]         - Get user by ID
PUT    /api/users/[id]         - Update user
DELETE /api/users/[id]         - Delete user
```

#### Projects
```
GET    /api/projects           - List all projects
POST   /api/projects           - Create new project
```

#### Tasks
```
GET    /api/tasks              - List all tasks
POST   /api/tasks              - Create new task
```

#### Activity Logs
```
GET    /api/activity-logs      - List all activity logs
POST   /api/activity-logs      - Create activity log
```

### 5. **Database Initialization**

To populate the database with sample data, run:
```bash
curl http://localhost:3000/api/init-db
```

Or navigate to: `http://localhost:3000/api/init-db`

This will automatically insert all mock data into your MongoDB database.

## 🚀 Quick Start

### 1. Start the development server
```bash
npm run dev
```

### 2. Initialize the database
```bash
# Option 1: Using curl
curl http://localhost:3000/api/init-db

# Option 2: Visit in browser
http://localhost:3000/api/init-db
```

### 3. Access the application
```
http://localhost:3000
```

## 📝 Environment Variables

Your `.env.local` contains:
```
MONGODB_URI=mongodb+srv://rohitunfoldcro_db_user:cY3AwzBjO6fVNAUq@cluster0.t4phqrk.mongodb.net/?appName=Cluster0
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Security Note ⚠️
- **Never commit `.env.local` to version control** (already in .gitignore)
- **Never expose your database credentials** in logs or error messages
- Consider rotating your MongoDB password periodically
- Use read-only credentials for non-admin operations in production

## 🔄 Using Database Services

Import database service utilities in your components:

```typescript
import { 
  fetchUsers, 
  createUser, 
  updateUser, 
  deleteUser 
} from '@/lib/db-service';

// Fetch users from database
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

## 📊 Database Schema

### User Collection
```typescript
{
  name: String (required)
  email: String (required, unique)
  phone: String
  timezone: String
  role: 'super_admin' | 'admin' | 'manager' | 'developer' | 'agency_user'
  status: 'active' | 'inactive'
  agency_id: String
  password: String
  notificationPreferences: {
    email: Boolean
    inApp: Boolean
    slack: Boolean
  }
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### Project Collection
```typescript
{
  name: String (required)
  agency_id: String (required)
  client_id: String
  status: 'pending_intake' | 'in_progress' | 'awaiting_review' | 'approved' | 'completed' | 'on_hold'
  type: String
  description: String
  budget: Number
  pricing_model: 'fixed' | 'hourly' | 'retainer'
  deadline: Date
  progress: Number (0-100)
  internal_notes: String
  attachments: [String]
  created_by: String
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## 🐛 Troubleshooting

### Connection Failed
```
Error: connect ECONNREFUSED
```
- Verify MongoDB URI in `.env.local`
- Check MongoDB cluster is running
- Ensure IP whitelist includes your current IP

### Authentication Error
```
Error: invalid username [rohitunfoldcro_db_user]
```
- Verify username and password are correct in MongoDB URI
- Check credentials haven't expired
- Reset password in MongoDB Atlas if needed

### Data Not Appearing
- Run initialization: `curl http://localhost:3000/api/init-db`
- Check MongoDB Atlas dashboard for data
- Clear browser cache and reload

## 🔗 MongoDB Atlas

Access your MongoDB cluster:
1. Go to [MongoDB Atlas](https://account.mongodb.com/account/login)
2. Log in with your account
3. Navigate to Cluster0
4. View data in the Collections tab

## ✨ Next Steps

1. ✅ MongoDB connection established
2. ✅ API routes configured
3. ✅ Database models created
4. ⏭️ **Run `/api/init-db` to populate database**
5. ⏭️ Update frontend components to fetch from `/api/` endpoints
6. ⏭️ Connect User Management module to database
7. ⏭️ Set up authentication with MongoDB

## 📞 Support

For MongoDB issues, visit:
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas Support](https://www.mongodb.com/support)
