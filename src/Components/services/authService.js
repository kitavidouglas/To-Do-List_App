import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const authService = {
    login: async (credentials) => {
        const response = await axios.post(`${API_URL}/login`, credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    register: async (userData) => {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    }
};

export default authService;
