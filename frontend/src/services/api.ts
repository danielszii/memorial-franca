import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://memorial-franca.onrender.com/franca',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})