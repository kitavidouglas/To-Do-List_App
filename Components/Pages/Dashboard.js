import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import taskService from '../../services/taskService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await taskService.getTasks();
                setTasks(data);
            } catch (error) {
                setMessage('Error fetching tasks.');
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    return (
        <Container>
            <h2 className="my-4">My Tasks</h2>
            {message && <Alert variant="danger">{message}</Alert>}
            {loading ? <Spinner animation="border" /> : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Due Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task._id}>
                                <td>{task.title}</td>
                                <td>{task.dueDate}</td>
                                <td>
                                    <Button variant="primary" onClick={() => navigate(`/edit-task/${task._id}`)}>Edit</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default Dashboard;
