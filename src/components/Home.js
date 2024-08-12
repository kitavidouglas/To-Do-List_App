import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('token');
            if (!token) navigate('/login');
            try {
                const res = await axios.get('http://localhost:5000/tasks', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTasks(res.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, [navigate]);

    const handleAddTask = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/tasks', { title: newTask }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewTask('');
            // Fetch tasks again to update the list
            const res = await axios.get('http://localhost:5000/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    return (
        <Container className="mt-5">
            <h2>Your Tasks</h2>
            <Form className="mb-3">
                <Form.Group controlId="formBasicTask">
                    <Form.Control
                        type="text"
                        placeholder="New Task"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleAddTask} className="mt-2">
                    Add Task
                </Button>
            </Form>
            <ListGroup>
                {tasks.map(task => (
                    <ListGroup.Item key={task._id}>
                        {task.title}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
};

export default Home;
