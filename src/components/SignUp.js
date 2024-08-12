import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Clear previous messages
        setMessage('');
        
        // Basic validation
        if (!email || !password || !confirmPassword) {
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
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(`${API_URL}/signup`, { email, password });
            if (response.data && response.data.message === 'User registered successfully') {
                setMessage('Sign up successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage('Sign up failed: ' + response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage('Error: ' + error.response.data.message);
            } else {
                setMessage('Error connecting to the server');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: '20rem' }} className="shadow">
                <Card.Body>
                    <Card.Title className="text-center mb-4">Sign Up</Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                aria-label="Password"
                            />
                        </Form.Group>

                        <Form.Group controlId="formConfirmPassword" className="mt-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                aria-label="Confirm Password"
                            />
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100 mt-3" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Sign Up'}
                        </Button>
                    </Form>
                    {message && <p className="text-center mt-3">{message}</p>}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SignUp;