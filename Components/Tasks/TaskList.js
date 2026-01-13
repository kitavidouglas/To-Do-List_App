import React, { useEffect, useState } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import taskService from '../../services/taskService';
import express from 'express';
import { json } from 'express';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await taskService.getTasks();
                setTasks(response);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const handleDelete = async (taskId) => {
        await taskService.deleteTask(taskId);
        setTasks(tasks.filter(task => task._id !== taskId));
    };

    return (
        <Card className="shadow">
            <Card.Body>
                <Card.Title>Task List</Card.Title>
                {loading ? <Spinner animation="border" /> : (
                    <ul>
                        {tasks.map(task => (
                            <li key={task._id} className="d-flex justify-content-between">
                                {task.title}
                                <Button variant="danger" size="sm" onClick={() => handleDelete(task._id)}>Delete</Button>
                            </li>
                        ))}
                    </ul>
                )}
            </Card.Body>
        </Card>
    );
};

export default TaskList;
