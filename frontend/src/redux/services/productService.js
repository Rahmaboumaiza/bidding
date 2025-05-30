import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

export const PRODUCT_URL =`${BACKEND_URL}/product`;

const createProduct = async (formData) => {
  const response = await axios.post(PRODUCT_URL,formData);
  return response.data;
};
const getAllProduct = async () => {
  const response = await axios.get(`${PRODUCT_URL}`);
  return response.data;
};

const getAllProductOfUser = async () => {
  const response = await axios.get(`${PRODUCT_URL}/user`);
  return response.data;
};

const getAllWonProductOfUser = async () => {
  const response = await axios.get(`${PRODUCT_URL}/won-products`);
  return response.data;
};

const deleteProduct = async (id) => {
  const response = await axios.delete(`${PRODUCT_URL}/${id}`);
  return response.data;
};

const getProduct = async (id) => {
  const response = await axios.get(`${PRODUCT_URL}/${id}`);
  return response.data;
};


const updateProduct = async (id,formData) => {
  const response = await axios.put(`${PRODUCT_URL}/${id}`,formData);
  return response.data;
};

const updateProductByAdmin = async (id,formData) => {
  const response = await axios.patch(`${PRODUCT_URL}/admin/product-verified/${id}`,formData);
  return response.data;
};

const  updateVerify= async (id, formData) => {
  const response = await axios.patch(`${PRODUCT_URL}/admin/verify/${id}`,
     formData,
    {
      withCredentials: true, // ✅ This sends cookies with the request
    }
  );
  return response.data;
};


const expireProduct = async (productId) => {
  try {
      console.log(`Requesting PATCH ${PRODUCT_URL}/${productId}/expire`);
    await axios.patch(`${PRODUCT_URL}/${productId}/expire`);
    console.log("Product marked as expired");
  } catch (error) {
    console.error("Failed to mark product as expired", error);
  }
};



const productService={
    createProduct,
    getAllProduct, 
    getProduct,
    getAllProductOfUser, 
    getAllWonProductOfUser,
    deleteProduct,
    updateProduct,
    updateProductByAdmin,
    updateVerify,
    expireProduct,
};

export default productService;