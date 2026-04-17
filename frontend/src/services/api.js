import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:5000/api',
  baseURL: 'https://mern-notes-app-7m51.onrender.com'/api,
  withCredentials: true, 
});

export default api;
