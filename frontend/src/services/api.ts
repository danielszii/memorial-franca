import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/franca',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'

const [resEras, resMembers] = await Promise.all([
  axios.get(`${API_URL}/eras`),
  axios.get(`${API_URL}/members`),
])