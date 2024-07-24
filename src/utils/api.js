// src/utils/api.js
import axios from 'axios';

export const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://localhost:5000/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};
