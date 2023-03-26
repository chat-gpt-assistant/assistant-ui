import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1/',
  headers: {
    Authorization: `user@user`, // TODO: use JWT interceptor
  }
});

export default axiosInstance;
