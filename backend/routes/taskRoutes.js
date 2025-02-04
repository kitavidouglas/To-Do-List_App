const express = require('express');
const Task = require('../models/Task');
const Event = require('../models/Event');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// CRUD for Tasks
router.post('/tasks', protect, async (req, res) => {
  const { title, description, category, reminder } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      category,
      reminder,
      user: req.user._id,
    });

    const task = await newTask.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error });
  }
});

router.get('/tasks', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});

router.put('/tasks/:id', protect, async (req, res) => {
  const { title, description, category, reminder, completed } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    task.title = title;
    task.description = description;
    task.category = category;
    task.reminder = reminder;
    task.completed = completed;

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error });
  }
});

// CRUD for Events
router.post('/events', protect, async (req, res) => {
  const { title, description, date } = req.body;

  try {
    const newEvent = new Event({
      title,
      description,
      date,
      user: req.user._id,
    });

    const event = await newEvent.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: 'Error creating event', error });
  }
});

router.get('/events', protect, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
});

module.exports = router;
