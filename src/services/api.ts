// axiosWrapper.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  //   baseURL: "https://api.example.com", // Replace with your actual base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token or logging here
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  },
);

// Generic wrapper
const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.get(url, config);
    return response.data;
  },

  post: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.post(
      url,
      data,
      config,
    );
    return response.data;
  },

  put: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.put(
      url,
      data,
      config,
    );
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.delete(url, config);
    return response.data;
  },
};

export default api;
