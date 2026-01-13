import React, { useEffect, useState } from 'react';
import { Container, Card, ListGroup, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import taskService from '../../services/taskService';
import { useNavigate } from 'react-router-dom';

const Reminder = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await taskService.getTasks();
                if (response.data) {
                    // Sort tasks by due date (ascending) so that the earliest due tasks come first.
                    const sortedTasks = response.data.sort(
                        (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
                    );
                    setTasks(sortedTasks);
                } else {
                    setError('No tasks available.');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to retrieve tasks.');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Alert variant="danger">
                    {error}
                    <div className="mt-3">
                        <Button variant="primary" onClick={() => navigate('/dashboard')}>
                            Back to Dashboard
                        </Button>
                    </div>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Card className="shadow">
                <Card.Header className="bg-primary text-white">
                    <h4 className="mb-0">Reminders</h4>
                </Card.Header>
                <Card.Body>
                    {tasks.length === 0 ? (
                        <Alert variant="info">No tasks found. Please add new tasks!</Alert>
                    ) : (
                        <ListGroup variant="flush">
                            {tasks.map((task) => (
                                <ListGroup.Item key={task.id}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5 className="mb-1">{task.title}</h5>
                                            <p className="mb-1">{task.description}</p>
                                            <small className="text-muted">
                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                            </small>
                                        </div>
                                        <div>
                                            <Badge
                                                bg={
                                                    task.priority === 'High'
                                                        ? 'danger'
                                                        : task.priority === 'Low'
                                                        ? 'secondary'
                                                        : 'warning'
                                                }
                                                text={task.priority === 'High' ? 'light' : ''}
                                            >
                                                {task.priority}
                                            </Badge>
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Card.Body>
                <Card.Footer className="text-end">
                    <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                        Back to Dashboard
                    </Button>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default Reminder;
