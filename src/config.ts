export const API_URL = import.meta.env.PROD 
  ? 'https://expense-record-api.onrender.com/api'
  : 'http://localhost:3000/api';

// Add proper debug logging
if (import.meta.env.DEV) {
  console.log('Running in development mode');
  console.log('API_URL:', API_URL);
}