import { create } from 'apisauce';

const api = create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Function to set auth token
export const setAuthToken = (token: string) => {
  api.setHeader('Authorization', `Bearer ${token}`);
};

// Function to remove auth token
export const removeAuthToken = () => {
  api.deleteHeader('Authorization');
};

export default api;
