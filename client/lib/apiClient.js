import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:8000",
});
export const signup = (data) => API.post("/api/auth/signup", data, { withCredentials: true });
export const signin = (data) => API.post("/api/auth/login", data, { withCredentials: true });
export const getBooks = (params) => API.get("/api/books", { params, withCredentials: true });
export const addBook = (data) => API.post("/api/books/addbook", data, { withCredentials: true });
export const deleteBook = (id) => API.delete(`/api/books/deletebook/${id}`, { withCredentials: true });
export const updateBook = (id, data) => API.put(`/api/books/updatebook/${id}`, data, { withCredentials: true });

export const getUserDetails = () => API.get("/api/users/user", { withCredentials: true });

export const getAnalytics = () => API.get("/api/books/analytics", { withCredentials: true });
