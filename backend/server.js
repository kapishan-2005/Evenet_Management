const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware'); // BUG FIX 6: Import error middleware
const { deleteExpiredEvents } = require('./controllers/eventController');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/health', require('./routes/health'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// BUG FIX 6: Use proper error middleware with status codes and stack traces
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  
  // Run auto-delete cleanup on server start
  console.log('[Auto Delete] Running initial cleanup...');
  deleteExpiredEvents();
  
  // Schedule auto-delete cleanup every 24 hours (86400000 ms)
  setInterval(() => {
    console.log('[Auto Delete] Running scheduled cleanup...');
    deleteExpiredEvents();
  }, 24 * 60 * 60 * 1000);
  
  console.log('[Auto Delete] Scheduler initialized - will run every 24 hours');
});
