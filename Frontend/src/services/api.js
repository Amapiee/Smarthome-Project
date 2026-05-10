import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const getLatestData = async (limit = 20) => {
    try{
        const response = await api.get('/latest')
        return response.data;
    } catch (error) {
        console.error('Error fetching latest sensor data in API call:', error);
        throw error;
    }
};

export const getChartData = async () => {
    try{
        const response = await api.get('/chart')
        return response.data;
    } catch (error) {
        console.error('Error fetching chart data in API call:', error);
        throw error;
    }
};

export const getSensorHistory = async (limit = 20) => {
    try{
        const response = await api.get('/history?limit=' + limit)
        return response.data;
    } catch (error) {
        console.error('Error fetching sensor history in API call:', error);
        throw error;
    }
};