import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('/api/tasks', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => setTasks(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleComplete = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task._id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    axios.put(`/api/tasks/${taskId}`, { completed: !task.completed }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  };

  return (
    <div>
      <h2>Today's Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>{task.category}</p>
              <button onClick={() => handleComplete(task._id)}>
                {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
