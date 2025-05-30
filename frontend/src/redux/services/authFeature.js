import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

export const AUTH_URL =`${BACKEND_URL}/users/`;

const register = async (userData) => {
  const response = await axios.post(AUTH_URL + "register", userData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
};

const login =async(userData)=>{
    const response =await axios.post(AUTH_URL+"login",userData);
    return response.data;
};

const logOut =async()=>{
    const response =await axios.get(AUTH_URL+"logout");
    return response.data.message;
};

const getLogInstatus =async()=>{
    const response =await axios.get(AUTH_URL+"loggedin");
    return response.data;
};

const getuserProfile = async () => {
  const token = localStorage.getItem('token'); // or get it from Redux if needed

  if (!token) {
    throw new Error("No token found");
  }

  const response = await axios.get(AUTH_URL + "getuser", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const loginUserAsSeller =async(userData)=>{
    const response =await axios.post(`${AUTH_URL}seller`,userData ,{
    withCredentials:true,
    });
    return response.data;
};


const getUserIncome = async () => {
  const response = await axios.get(`${AUTH_URL}sell-amount`, {
  withCredentials: true, // ✅ this line is crucial
    });
    return response.data;
};


const getIncome = async () => {
  const response = await axios.get(AUTH_URL + "estimate-income");
  return response.data;
};

const getAllUser = async () => {
  const response = await axios.get(AUTH_URL + "users");
  return response.data;
};

const authService={
    register,
    login,
    logOut,
    getLogInstatus,
    getuserProfile,
    loginUserAsSeller,
    getUserIncome,
    getIncome,
    getAllUser,
};

export default authService;