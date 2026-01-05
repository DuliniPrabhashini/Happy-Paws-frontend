import axios, { AxiosError, AxiosRequestConfig } from "axios";

// const API_BASE_URL = "http://localhost:5000/api/happy-paws";
const API_BASE_URL = "https://happy-paws-backend.vercel.app/api/happy-paws"
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (!error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        return Promise.reject(error);
      }
      try {
        const res = await api.post("/auth/refreshToken", { refreshToken });

        const { accessToken, refreshToken: newRefreshToken } = res.data;

        setTokens(accessToken, newRefreshToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${accessToken}`,
        };
        return api(originalRequest);
      } catch (err) {
        clearTokens();
        return Promise.reject(err);
      }
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

  resetPassword: ({
    email,
    code,
    newPassword,
  }: {
    email: string;
    code: string;
    newPassword: string;
  }) => api.post("/auth/reset_password", { email, code, newPassword }),
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
  sendMessage: (data: string) => api.post("/chat/chatbot", { data }),
};

export const profileApi = {
  getProfile: () => api.get("/profile/getMyProfile"),
  updateProfile: (data: FormData) =>
    api.post("/profile/updateProfile", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteAccount: (email: string, password: string) =>
    api.delete("/profile/deleteAccount", {
      data: { email, password },
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

  getPetDetailsReminder: () => api.get(`/pet-details/getMyPetDetailsReminder`),
};

export default api;
