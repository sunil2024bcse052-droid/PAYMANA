require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const progressRoutes = require('./routes/progressUpdates');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/progress-updates', progressRoutes);

// 404 for anything unmatched
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Must be last - catches errors from any route via next(err)
app.use(errorHandler);

module.exports = app;