import axios from "axios";
import { redirect } from "next/navigation";
import { unauthorized } from "next/server";

export const useApi = () => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        unauthorized();
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
