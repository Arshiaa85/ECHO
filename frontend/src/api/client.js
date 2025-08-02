import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // Your Django backend URL
  withCredentials: true, // This is crucial for sending cookies
});

export default apiClient;