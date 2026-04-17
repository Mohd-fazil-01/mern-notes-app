import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:5000/api',
  baseURL: 'https://notes-app-2-b.onrender.com,
  withCredentials: true, 
});

export default api;
