# Golden Curator - Admin Dashboard

A full-stack admin dashboard application for managing events, users, messages, and system settings.

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (File Upload)

### Frontend
- React + Vite
- Tailwind CSS
- Recharts (Data Visualization)
- Axios (API Client)

## Features

- 🔐 JWT Authentication
- 👥 User Management (CRUD, Block/Unblock)
- 📅 Event Management (CRUD, Approve/Reject, Auto-Delete)
- 📧 Message/Inbox System
- 📊 Dashboard with Real-time Analytics
- ⚙️ Settings Management (Brand, Logo, Colors)
- 🖼️ Image Upload for Events and Logos
- 📱 Responsive Design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory by copying `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
```

**Getting MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with your database name (e.g., `admin_dashboard`)

Example:
```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/admin_dashboard?retryWrites=true&w=majority
```

**JWT Secret:**
Generate a random secret key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Seed Admin User

Create the default admin account:

```bash
npm run seed:admin
```

This creates an admin user with:
- **Email:** admin@example.com
- **Password:** password

### 5. (Optional) Seed Sample Data

To populate the database with sample users, events, and messages:

```bash
npm run seed:sample
```

This creates:
- 4 sample users
- 5 sample events
- 4 sample messages
- Default settings

### 6. Start Backend Server

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 7. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## Login Credentials

### Admin Account
- **Email:** admin@example.com
- **Password:** password

### Sample User Accounts (if seeded)
- **Email:** john@example.com | **Password:** password123
- **Email:** jane@example.com | **Password:** password123
- **Email:** bob@example.com | **Password:** password123

## Available Scripts

### Backend

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run seed:admin   # Create admin user
npm run seed:sample  # Create sample data
```

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## MongoDB Collections

**No manual collection creation required!** Collections are automatically created by Mongoose when data is inserted.

The following collections will be created automatically:
- `users` - User accounts
- `events` - Event listings
- `messages` - Contact messages
- `settings` - System settings

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/block` - Block user
- `PATCH /api/users/:id/unblock` - Unblock user

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (multipart/form-data)
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `PATCH /api/events/:id/approve` - Approve event
- `PATCH /api/events/:id/reject` - Reject event

### Messages
- `GET /api/messages` - Get all messages
- `PATCH /api/messages/:id/read` - Mark as read
- `DELETE /api/messages/:id` - Delete message

### Reports
- `GET /api/reports/summary` - Dashboard summary
- `GET /api/reports/recent-activity` - Recent activity
- `GET /api/reports/event-status` - Event statistics
- `GET /api/reports/monthly-users` - Monthly user stats

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings
- `POST /api/settings/upload-logo` - Upload logo (multipart/form-data)

## Project Structure

```
.
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/              # Route controllers
│   ├── middleware/               # Auth, error, upload middleware
│   ├── models/                   # Mongoose models
│   ├── routes/                   # API routes
│   ├── scripts/                  # Seed scripts
│   ├── uploads/                  # Uploaded files
│   ├── .env.example              # Environment template
│   ├── server.js                 # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   ├── context/              # React context (Auth)
│   │   ├── pages/                # Page components
│   │   ├── services/             # API service
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   ├── public/                   # Static assets
│   ├── index.html
│   └── package.json
│
└── README.md
```

## Features Overview

### Dashboard (Reports)
- Real-time statistics (users, events, messages)
- Event submission trends chart
- Recent activity log
- Category and district analytics

### User Management
- View all users
- Create/delete users
- Block/unblock users
- Search functionality

### Event Management
- View all events with status badges
- Create events with image upload
- Approve/reject pending events
- Auto-delete expired events
- Date range support (start, end, auto-delete)

### Inbox
- View contact messages
- Mark messages as read
- Delete messages
- Real-time unread count

### Settings
- Update brand name
- Change primary color
- Upload logo
- View system status

## Auto-Delete Feature

Events with an `autoDeleteDate` are automatically deleted:
- On server startup
- Every 24 hours
- Before fetching events (GET /api/events)

This ensures expired events are removed without manual intervention.

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongooseServerSelectionError"**
- Check your MONGO_URI is correct
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify database user credentials

**Error: "Authentication failed"**
- Check database username and password
- Ensure user has read/write permissions

### Port Already in Use

**Backend (Port 5000):**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000   # Windows
```

**Frontend (Port 5173):**
```bash
# Find and kill process
lsof -ti:5173 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5173   # Windows
```

### Admin Login Not Working

1. Ensure you ran `npm run seed:admin`
2. Check MongoDB connection
3. Verify JWT_SECRET is set in .env
4. Clear browser localStorage and try again

## Security Notes

- Change default admin password after first login
- Use strong JWT_SECRET in production
- Never commit `.env` file to version control
- Enable MongoDB IP whitelist in production
- Use HTTPS in production

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
