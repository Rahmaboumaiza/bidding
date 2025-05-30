import axios from 'axios';

const API_URL = "http://localhost:5000/api/users"; 

export const getFavoritesAPI = async () => {
  const response = await axios.get(`${API_URL}/favorites`);
  return response.data;
};

export const addFavoriteAPI = async (productId) => {
  console.log('Sending productId:', productId);
  try {
    const response = await axios.post(`${API_URL}/favorites/${productId}`);
    return response.data;
  } catch (err) {
    console.error('Error:', {
      status: err.response?.status,
      url: err.config?.url,
      data: err.response?.data
    });
    throw err;
  }
};

export const removeFavoriteAPI = async (productId) => {
  await axios.delete(`${API_URL}/favorites/${productId}`);
};
