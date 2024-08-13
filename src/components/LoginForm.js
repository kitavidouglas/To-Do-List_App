import React, { useState } from 'react';
import { Container, Form, Button, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        // Basic validation
        if (!email || !password) {
            setMessage('Please fill in all fields.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setMessage('Please enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            setMessage('Password must be at least 6 characters long.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Send login request to backend
            const response = await axios.post(`${API_URL}/login`, { email, password });

            if (response.data.token) {
                try {
                    localStorage.setItem('token', response.data.token); // Store token in localStorage
                } catch (storageError) {
                    console.error('Error storing token:', storageError);
                    setMessage('Error storing login token.');
                    return;
                }
                setMessage('Login successful! Redirecting to home page...');
                setTimeout(() => {
                    navigate('/home'); // Redirect to the home page
                }, 2000);
            } else {
                setMessage(response.data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.message || 'Login failed. Please try again.');
            } else if (error.request) {
                setMessage('Network error. Please try again later.');
            } else {
                setMessage('Error connecting to the server.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoHome = () => {
        navigate('/home');
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: '20rem' }} className="shadow">
                <Card.Body>
                    <Card.Title className="text-center mb-4">Login</Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                aria-label="Email address"
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword" className="mt-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                aria-label="Password"
                            />
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100 mt-3" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Login'}
                        </Button>

                        <Button 
                            variant="secondary" 
                            className="w-100 mt-2" 
                            onClick={handleGoHome}
                        >
                            Home
                        </Button>
                    </Form>
                    {message && <p className="text-center mt-3 text-danger">{message}</p>}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LoginForm;
