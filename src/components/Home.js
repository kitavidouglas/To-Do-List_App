import React, { useState, useEffect } from 'react';
import './Home.css';
import { Container, Row, Col, Card, Button, Form, ListGroup, Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaBell, FaCalendarAlt, FaSearch } from 'react-icons/fa';

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [reminderDate, setReminderDate] = useState('');

    useEffect(() => {
        setTasks([
            { id: 1, text: 'Learn React', completed: false, category: 'Work', reminder: '' },
            { id: 2, text: 'Build a to-do list app', completed: false, category: 'Business', reminder: '' },
        ]);
    }, []);

    const handleShowModal = (category) => {
        setSelectedCategory(category);
        setShowModal(true);
    };

    const handleAddTask = () => {
        if (newTask.trim()) {
            if (editTask) {
                setTasks(tasks.map(task =>
                    task.id === editTask.id ? { ...task, text: newTask, reminder: reminderDate } : task
                ));
                setEditTask(null);
            } else {
                setTasks([...tasks, {
                    id: tasks.length + 1,
                    text: newTask,
                    completed: false,
                    category: selectedCategory,
                    reminder: reminderDate
                }]);
            }
            setNewTask('');
            setReminderDate('');
            setShowModal(false);
        }
    };

    const handleEditTask = (task) => {
        setNewTask(task.text);
        setEditTask(task);
        setSelectedCategory(task.category);
        setReminderDate(task.reminder);
        setShowModal(true);
    };

    const handleDeleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const toggleTaskCompletion = (taskId) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    const categorizedTasks = (category) => {
        return tasks.filter(task => task.category === category);
    };

    const renderTaskList = (category) => (
        <ListGroup>
            {categorizedTasks(category).map(task => (
                <ListGroup.Item
                    key={task.id}
                    variant={task.completed ? 'success' : ''}
                    className="d-flex justify-content-between align-items-center"
                    style={{ borderBottom: '1px solid #eee' }}
                >
                    <div onClick={() => toggleTaskCompletion(task.id)} style={{ cursor: 'pointer' }}>
                        {task.text}
                    </div>
                    <div>
                        <FaEdit onClick={() => handleEditTask(task)} style={{ cursor: 'pointer', marginRight: '10px', color: '#5A5A5A' }} />
                        <FaTrash onClick={() => handleDeleteTask(task.id)} style={{ cursor: 'pointer', marginRight: '10px', color: '#FF6347' }} />
                        {task.reminder && <FaBell style={{ color: 'orange' }} />}
                    </div>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );

    return (
        <Container fluid>
            <Row>
                {/* Sidebar */}
                <Col md={3} className="bg-light sidebar">
                    <div className="d-flex flex-column align-items-center">
                        <div className="user-profile mb-4">
                            <img src="profile_image_url" alt="User" className="profile-img" />
                            <div className="mt-2">Kitavi</div>
                        </div>
                        <div className="d-flex flex-column w-100">
                            <Button variant="link" className="sidebar-button">
                                <FaSearch /> Search
                            </Button>
                            <Button variant="link" className="sidebar-button">
                                <FaBell /> Notifications
                            </Button>
                            <Button variant="link" className="sidebar-button">
                                <FaCalendarAlt /> Today
                            </Button>
                            <Button variant="link" className="sidebar-button">
                                <FaCalendarAlt /> Upcoming
                            </Button>
                            <Button variant="link" className="sidebar-button">
                                <FaCalendarAlt /> Filters & Labels
                            </Button>
                        </div>
                    </div>
                </Col>
                {/* Main Content */}
                <Col md={9}>
                    <Container className="my-4">
                        <h1 className="text-center mb-4">Today's Tasks</h1>
                        <div className="card-grid">
                            {['Work', 'Family', 'Health & Fitness', 'Business'].map(category => (
                                <Card key={category} className="card">
                                    <Card.Body>
                                        <Card.Title className="card-title">
                                            <span className={`icon ${category.toLowerCase()}`}></span>
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

                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>{editTask ? 'Edit Task' : 'Add New Task'}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group controlId="taskText">
                                        <Form.Label>Task</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter task"
                                            value={newTask}
                                            onChange={(e) => setNewTask(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="reminderDate" className="mt-3">
                                        <Form.Label>Reminder</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={reminderDate}
                                            onChange={(e) => setReminderDate(e.target.value)}
                                        />
                                        <FaCalendarAlt className="mt-2" style={{ marginLeft: '5px', color: '#FF6347' }} />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={handleAddTask}>
                                    {editTask ? 'Save Changes' : 'Add Task'}
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
