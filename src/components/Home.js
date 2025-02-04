import React, { useState, useEffect } from 'react';
import './Home.css';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { FaPlus, FaBell, FaCalendarAlt, FaUserCircle, FaFilter, FaKey, FaCog, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Notifications from './Notifications';
import UpcomingEvents from './UpcomingEvents';
import FiltersLabels from './FiltersLabels';

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [reminderDate, setReminderDate] = useState('');
    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchedUser = {
            name: 'Kitavi Douglas Kimani',
            email: 'kitavi.douglas@example.com',
            profileImage: 'https://via.placeholder.com/100',
        };
        setUser(fetchedUser);

        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('/api/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleShowModal = (category) => {
        setSelectedCategory(category);
    };

    const categorizedTasks = (category) => {
        return tasks.filter(task => task.category === category);
    };

    const renderTaskList = (category) => (
        <ListGroup>
            {categorizedTasks(category).map(task => (
                <ListGroup.Item
                    key={task._id}
                    variant={task.completed ? 'success' : ''}
                    className="d-flex justify-content-between align-items-center"
                    style={{ borderBottom: '1px solid #eee' }}
                >
                    <div>{task.title}</div>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );

    return (
        <Router>
            <Container fluid>
                <Row>
                    {/* Sidebar */}
                    <Col md={3} className="bg-light sidebar">
                        <div className="d-flex flex-column align-items-center mt-3">
                            <img
                                src={user.profileImage}
                                alt="User"
                                className="profile-img mb-3"
                                style={{ borderRadius: '50%', width: '80px', height: '80px' }}
                            />
                            <div className="text-center">
                                <h5>{user.name}</h5>
                                <p className="text-muted">Welcome, {user.name.split(' ')[0]}</p>
                            </div>
                            <div className="d-flex flex-column w-100 mt-3">
                                <Link to="/notifications" className="sidebar-button">
                                    <FaBell /> Notifications
                                </Link>
                                <Link to="/upcoming-events" className="sidebar-button">
                                    <FaCalendarAlt /> Upcoming Events
                                </Link>
                                <Link to="/filters-labels" className="sidebar-button">
                                    <FaFilter /> Filters & Labels
                                </Link>
                                <Button variant="link" className="sidebar-button" href="/profile">
                                    <FaUserCircle /> Profile
                                </Button>
                                <Button variant="link" className="sidebar-button" href="/reset-password">
                                    <FaKey /> Reset Password
                                </Button>
                                <Button variant="link" className="sidebar-button">
                                    <FaCog /> Settings
                                </Button>
                                <Button variant="link" className="sidebar-button" href="/logout">
                                    <FaSignOutAlt /> Logout
                                </Button>
                            </div>
                        </div>
                    </Col>

                    {/* Main Content */}
                    <Col md={9}>
                        <Container className="my-4">
                            <Routes>
                                <Route path="/" element={
                                    <>
                                        <h1 className="text-center mb-4">Today's Tasks</h1>
                                        <div className="card-grid">
                                            {['Work', 'Family', 'Health & Fitness', 'Business'].map(category => (
                                                <Card key={category} className="card">
                                                    <Card.Body>
                                                        <Card.Title className="card-title">
                                                            {category}
                                                        </Card.Title>
                                                        {renderTaskList(category)}
                                                        <div className="button-group">
                                                            <Button
                                                                className="add-task-btn"
                                                                onClick={() => handleShowModal(category)}
                                                            >
                                                                <FaPlus /> Add Task
                                                            </Button>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            ))}
                                        </div>
                                    </>
                                } />
                                <Route path="/notifications" element={<Notifications tasks={tasks} />} />
                                <Route path="/upcoming-events" element={<UpcomingEvents tasks={tasks} />} />
                                <Route path="/filters-labels" element={<FiltersLabels tasks={tasks} />} />
                            </Routes>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </Router>
    );
};

export default Home;
