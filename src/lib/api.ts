import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/happy-paws';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  forgotPassword: (email: string) =>
    api.post('/auth/forget_password', { email }),
};

// Pet API
export const petApi = {
  getMyPets: () => api.get('/home/getMyPet'),
  addPet: (data: FormData) =>
    api.post('/home/addPet', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updatePet: (data: FormData) =>
    api.post('/home/updatePet', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deletePet: (petId: string) =>
    api.delete('/home/deletePet', { data: { petId } }),
};

// Disease API
export const diseaseApi = {
  getAllDiseases: () => api.get('/diseases/getAllDisease'),
  getMyDiseases: () => api.get('/diseases/getAllDiseasesByUser'),
  
  addDisease: (data: FormData) =>
    api.post('/diseases/addDisease', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateDisease: (data: FormData) =>
    api.post('/diseases/updateDisease', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteDisease: (diseaseId: string) =>
    api.delete('/diseases/deleteDisease', { data: { diseaseId } }),
};

// Chat API
export const chatApi = {
  sendMessage: (message: string) =>
    api.post('/chat/chatbot', { message }),
};

// Profile API
export const profileApi = {
  getProfile: () => api.get('/profile/getMyProfile'),
  updateProfile: (data: FormData) =>
    api.post('/profile/updateProfile', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default api;
