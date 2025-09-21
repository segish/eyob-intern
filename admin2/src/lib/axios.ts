import axios from "axios";

const axiosInstance= axios.create({
  baseURL:"https://eyob-intern2.onrender.com/api",
  withCredentials:true,
});


export default axiosInstance;

