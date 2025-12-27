const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Error Handler
app.use(errorHandler);

module.exports = app;
