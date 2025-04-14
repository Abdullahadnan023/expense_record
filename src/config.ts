export const API_URL = import.meta.env.MODE === 'production' 
  ? 'https://expense-record-api.onrender.com/api' 
  : 'http://localhost:3000/api';

if (import.meta.env.MODE === 'development') {
  console.log('Running in development mode');
  console.log('API_URL:', API_URL);
}
