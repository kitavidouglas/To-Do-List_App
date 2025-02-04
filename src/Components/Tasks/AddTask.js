import React, { useState } from 'react';
import { Form, Button, Container, Card, Spinner, Alert } from 'react-bootstrap';
import taskService from '../../services/taskService';
import { useNavigate } from 'react-router-dom';

const AddTask = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Normal');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!title || !description || !dueDate) {
            setMessage('All fields are required.');
            return;
        }

        setIsSubmitting(true);

        try {
            await taskService.createTask({ title, description, dueDate, priority });
            setMessage('Task added successfully.');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to add task.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: '30rem' }} className="shadow">
                <Card.Body>
                    <Card.Title className="text-center mb-4">Add New Task</Card.Title>
                    {message && <Alert variant="info">{message}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter task title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter task details"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Priority</Form.Label>
                            <Form.Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option>Low</option>
                                <option>Normal</option>
                                <option>High</option>
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
                            {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Add Task'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AddTask;
