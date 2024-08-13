const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Import User model
require('dotenv').config(); // Load environment variables from .env file

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
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Ensure this is secure in production

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Compare the provided password with the stored hash
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate a token if needed (optional)
      const token = generateToken(user); // Replace with your token generation logic

      // Send the token and success message
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
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(409).json({ message: 'User already exists' });
      }

      // Hash the password before saving it
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Create a new user
      const newUser = new User({
          email,
          password: hashedPassword
      });

      // Save the user to the database
      await newUser.save();

      // Send a success message with the correct status code
      return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      console.error('Register error:', error.stack);
      return res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});



// Home route (optional)
app.get('/', (req, res) => {
  res.send('Welcome to the authentication API');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
