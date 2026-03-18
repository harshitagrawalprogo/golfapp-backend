const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const configRoutes = require('./routes/config');
const presetRoutes = require('./routes/preset');
const sessionRoutes = require('./routes/session');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});

// Middleware
app.use(limiter);
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/config', configRoutes);
app.use('/preset', presetRoutes);
app.use('/session', sessionRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/golf_biomechanics';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      
      // Self-ping keeping Render Free Tier alive every 14 minutes
      const LIVE_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
      setInterval(async () => {
        try {
          const res = await fetch(`${LIVE_URL}/health`);
          if (res.ok) console.log(`[Self-Ping] Keep-alive successful: ${new Date().toISOString()}`);
        } catch (e) {
          console.error(`[Self-Ping] Failed to keep alive: ${e.message}`);
        }
      }, 14 * 60 * 1000); // 14 mins

    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
