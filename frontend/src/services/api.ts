import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'; // Adjust if backend port is different

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const sendMessage = async (message: string) => {
    const response = await api.post('/chat', { message });
    return response.data;
};

export const getHistory = async () => {
    const response = await api.get('/history');
    return response.data;
};

export const clearHistory = async () => {
    const response = await api.delete('/history');
    return response.data;
};
