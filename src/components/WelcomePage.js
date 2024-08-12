// src/components/WelcomePage.js
import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';  // Import custom CSS

const WelcomePage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Redirect to tasks if the user is already logged in
        if (token) {
            navigate('/tasks');
        }
    }, [token, navigate]);

    const handleGetStarted = () => {
        navigate('/signup'); // Redirect to the sign-up page
    };

    return (
        <Container className="welcome-container d-flex flex-column justify-content-center align-items-center vh-100">
            <Row className="justify-content-center">
                <Col md={6} lg={4}>
                    <Card className="shadow-lg rounded">
                        <Card.Body className="text-center">
                            <Card.Title as="h2" className="mb-4">Welcome to Task Manager</Card.Title>
                            <Card.Text className="mb-4">
                                Organize your tasks and stay productive. 
                                Click the button below to get started with signing up.
                            </Card.Text>
                            <Button variant="primary" size="lg" className="px-4 py-2" onClick={handleGetStarted}>
                                Get Started
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default WelcomePage;
