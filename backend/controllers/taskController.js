import Task, { find, findByIdAndUpdate, findByIdAndDelete } from '../models/Task';

export async function createTask(req, res) {
    const { title, description, dueDate, category } = req.body;
    try {
        const newTask = new Task({
            title,
            description,
            dueDate,
            category,
            user: req.user.id, 
        });
        await newTask.save();
        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
}

export async function getTasks(req, res) {
    try {
        const tasks = await find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
}

export async function updateTask(req, res) {
    const { title, description, dueDate, completed } = req.body;
    try {
        const updatedTask = await findByIdAndUpdate(
            req.params.id,
            { title, description, dueDate, completed },
            { new: true }
        );
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
}

export async function deleteTask(req, res) {
    try {
        await findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
}
