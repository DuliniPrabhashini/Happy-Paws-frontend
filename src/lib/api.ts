import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = "http://localhost:5000/api/happy-paws";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post("/auth/register", { name, email, password }),
  forgotPassword: (email: string) =>
    api.post("/auth/forget_password", { email }),
};

export const petApi = {
  getMyPets: () => api.get("/pet/getMyPet"),
  addPet: (data: FormData) =>
    api.post("/pet/addPet", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updatePet: (data: FormData) =>
    api.post("/pet/updatePet", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deletePet: (petId: string) =>
    api.delete("/pet/deletePet", { data: { petId } }),
};

export const diseaseApi = {
  getAllDiseases: () => api.get("/diseases/getAllDisease"),
  
  getMyDiseases: () => api.get("/diseases/getAllDiseasesByUser"),

  addDisease: (data: FormData) =>
    api.post("/diseases/addDisease", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateDisease: (data: FormData) =>
    api.post("/diseases/updateDisease", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteDisease: (diseaseId: string) =>
  api.delete(`/diseases/deleteDisease/${diseaseId}`),

};

export const chatApi = {
  sendMessage: (message: string) => api.post("/chat/chatbot", { message }),
};

export const profileApi = {
  getProfile: () => api.get("/profile/getMyProfile"),
  updateProfile: (data: FormData) =>
    api.post("/profile/updateProfile", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const petDetailsApi = {

  getPetDetails: (petDetailId) =>
    api.get(`/pet-details/getMyPetDetails/${petDetailId}`),

  addPetDetail: (data: any) => api.post("/pet-details/addPetDetail", data),

  deletePetDetail: (detailId: string) =>
    api.delete("/pet-details/deletePetDetail", {
      params: { detailId },
    }),

  getPetDetailsReminder: () =>
    api.get(`/pet-details/getMyPetDetailsReminder`),
};

export default api;
