import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Spinner, Alert } from 'react-bootstrap';
import taskService from '../../services/taskService';
import { useNavigate, useParams } from 'react-router-dom';

const EditTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState({ title: '', description: '', dueDate: '', priority: 'Normal' });
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const data = await taskService.getTaskById(id);
                setTask(data);
            } catch (error) {
                setMessage('Failed to fetch task details.');
            }
        };
        fetchTask();
    }, [id]);

    const handleChange = (e) => setTask({ ...task, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        try {
            await taskService.updateTask(id, task);
            setMessage('Task updated successfully.');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (error) {
            setMessage('Error updating task.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: '30rem' }} className="shadow">
                <Card.Body>
                    <Card.Title className="text-center mb-4">Edit Task</Card.Title>
                    {message && <Alert variant="info">{message}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="title" value={task.title} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" name="description" rows={3} value={task.description} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control type="date" name="dueDate" value={task.dueDate} onChange={handleChange} required />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
                            {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Update Task'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditTask;
