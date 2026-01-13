import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const token = localStorage.getItem('token');

const taskService = {
    getTasks: async () => {
        const response = await axios.get(`${API_URL}/tasks`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    addTask: async (task) => {
        const response = await axios.post(`${API_URL}/tasks`, task, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    deleteTask: async (taskId) => {
        await axios.delete(`${API_URL}/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export default taskService;
