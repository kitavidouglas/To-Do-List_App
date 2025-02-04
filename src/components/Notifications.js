import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { FaBell } from 'react-icons/fa';

const Notifications = ({ tasks }) => {
    const notifications = tasks.filter(task => task.reminder); // Filter tasks with reminder

    return (
        <div>
            <h2>Notifications</h2>
            <ListGroup>
                {notifications.map(task => (
                    <ListGroup.Item key={task._id}>
                        <FaBell /> {task.title} - Reminder: {task.reminder}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default Notifications;
