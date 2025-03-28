import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('No authentication token found. Please log in.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data) {
                    setUser(response.data);
                } else {
                    setError('Failed to fetch user data.');
                }
            } catch (err) {
                setError('Error retrieving user information. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

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
                <Alert variant="danger" className="text-center">
                    {error}
                    <Button variant="primary" className="mt-3 w-100" onClick={() => navigate('/login')}>
                        Go to Login
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: '22rem' }} className="shadow">
                <Card.Body>
                    <Card.Title className="text-center mb-4">
                        Welcome, {user?.username || 'User'}! 🎉
                    </Card.Title>
                    <Card.Text className="text-center">
                        Email: <strong>{user?.email}</strong>
                    </Card.Text>
                    <Card.Text className="text-center text-muted">
                        You are logged in and ready to manage your tasks!
                    </Card.Text>

                    <Button variant="danger" className="w-100 mt-3" onClick={handleLogout}>
                        Logout
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Profile;
