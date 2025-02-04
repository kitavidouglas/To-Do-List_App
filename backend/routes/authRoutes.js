import { Router } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { hashSync, compareSync } from 'bcryptjs';
import User, { findOne } from '../models/User'; // Import User model
require('dotenv').config(); // Load environment variables from .env file

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Ensure this is secure in production

// Register route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password before saving it
    const hashedPassword = hashSync(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Register error:', error.stack);
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findOne({ email });
    if (user && compareSync(password, user.password)) {
      // Generate a JWT token
      const token = sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error.stack);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    verify(token, JWT_SECRET, (err, user) => {
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

// Example protected route
router.get('/profile', authenticateJWT, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}` });
});

export default router;
