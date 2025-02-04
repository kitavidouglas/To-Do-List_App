const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Task = require('./models/Task'); // Import Task model
const Event = require('./models/Event'); // Import Event model
const Notification = require('./models/Notification'); // Import Notification model
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/authDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }
      const token = generateToken(user); // Replace with your token generation logic
      return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
      console.error('Login error:', error.stack);
      return res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Protected route example
app.get('/profile', authenticateJWT, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}` });
});

// Register route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(409).json({ message: 'User already exists' });
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();
      return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      console.error('Register error:', error.stack);
      return res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Task CRUD operations
app.post('/tasks', authenticateJWT, async (req, res) => {
  const { title, description, dueDate } = req.body;
  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      user: req.user.id, // Associate task with the logged-in user
    });
    await newTask.save();
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    console.error('Error creating task:', error.stack);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});

app.get('/tasks', authenticateJWT, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error.stack);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

app.put('/tasks/:id', authenticateJWT, async (req, res) => {
  const { title, description, dueDate } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { title, description, dueDate }, { new: true });
    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error.stack);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});

app.delete('/tasks/:id', authenticateJWT, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error.stack);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

// Event Management
app.post('/events', authenticateJWT, async (req, res) => {
  const { title, description, date } = req.body;
  try {
    const newEvent = new Event({
      title,
      description,
      date,
      user: req.user.id,
    });
    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error('Error creating event:', error.stack);
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
});

app.get('/events', authenticateJWT, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error.stack);
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

// Notification Management
app.post('/notifications', authenticateJWT, async (req, res) => {
  const { message } = req.body;
  try {
    const newNotification = new Notification({
      message,
      user: req.user.id,
    });
    await newNotification.save();
    res.status(201).json({ message: 'Notification created successfully', notification: newNotification });
  } catch (error) {
    console.error('Error creating notification:', error.stack);
    res.status(500).json({ message: 'Error creating notification', error: error.message });
  }
});

app.get('/notifications', authenticateJWT, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.stack);
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
});

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the authentication API');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
