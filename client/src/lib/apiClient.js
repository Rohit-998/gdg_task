import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:8000",
  withCredentials: true,
});

export const signup = (data) => API.post("/api/auth/signup", data);
export const signin = (data) => API.post("/api/auth/login", data);
export const logout = () => API.post("/api/auth/logout");

export const getBooks = (params) => API.get("/api/books", { params });
export const addBook = (data) => API.post("/api/books/addbook", data);
export const deleteBook = (id) => API.delete(`/api/books/deletebook/${id}`);
export const updateBook = (id, data) => API.put(`/api/books/updatebook/${id}`, data);
export const borrowBook = (id) => API.post(`/api/books/borrow/${id}`);
export const returnBook = (id) => API.post(`/api/books/return/${id}`);

export const getUserDetails = () => API.get("/api/users/user");
export const getDashboardBooks = () => API.get("/api/users/dashboard");

export const getAnalytics = () => API.get("/api/books/analytics");