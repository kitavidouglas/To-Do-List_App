import express, { json } from 'express';
import connectDB from './config/db';
import cors from 'cors';
require('dotenv').config();
import express from 'express';
import { json } from 'express';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(json());
app.use(cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
