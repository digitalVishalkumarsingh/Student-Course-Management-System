import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Token automatically send with every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== AUTH ====================

export const signup = (data) => {
  return API.post("/auth/signup", data);
};

export const login = (data) => {
  return API.post("/auth/login", data);
};

// ==================== STUDENTS ====================

export const getStudents = (search = "") => {
  return API.get("/students", {
    params: search ? { search } : {},
  });
};

export const getStudent = (id) => {
  return API.get(`/students/${id}`);
};

export const createStudent = (data) => {
  return API.post("/students", data);
};

export const updateStudent = (id, data) => {
  return API.put(`/students/${id}`, data);
};

export const deleteStudent = (id) => {
  return API.delete(`/students/${id}`);
};

// ==================== COURSES ====================

export const getCourses = (search = "") => {
  return API.get("/courses", {
    params: search ? { search } : {},
  });
};

export const getCourse = (id) => {
  return API.get(`/courses/${id}`);
};

export const createCourse = (data) => {
  return API.post("/courses", data);
};

export const updateCourse = (id, data) => {
  return API.put(`/courses/${id}`, data);
};

export const deleteCourse = (id) => {
  return API.delete(`/courses/${id}`);
};

// ==================== ENROLLMENTS ====================

export const getEnrollments = () => {
  return API.get("/enrollments");
};

export const createEnrollment = (data) => {
  return API.post("/enrollments", data);
};

export const deleteEnrollment = (id) => {
  return API.delete(`/enrollments/${id}`);
};

// ==================== DASHBOARD ====================

export const getDashboard = () => {
  return API.get("/dashboard");
};

export default API;
