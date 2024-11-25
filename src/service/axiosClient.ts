import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://booker-bn.onrender.com/",
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers['Authorization'] = 'Token ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const statusCode = error.response?.status;

    if (statusCode === 401 || statusCode === 403) {
      localStorage.removeItem("token");
      window.location.href = "/";
    } else if (statusCode === 500) {
      alert("Something went wrong on the server. Please try again later.");
    } else if (statusCode >= 400 && statusCode < 500) {
      alert("An error occurred. Please check your input and try again.");
    }

    localStorage.setItem("error", JSON.stringify(error));

    return Promise.reject(error);
  }
);

export default axiosInstance;
