import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

export const BIDDING_URL =`${BACKEND_URL}/bidding`;

const placebid = async (fromData) => {
  const response = await axios.post(BIDDING_URL ,fromData);
  return response.data;
};

const fetchBiddingHistory = async (id) => {
  const response = await axios.get(`${BIDDING_URL}/${id}`);
  console.log("Bidding history response:", response.data); // Add this
  return response.data;
};

const sellproductsbyuser = async (productId) => {
  const response = await axios.post(`${BIDDING_URL}/sell`,productId);
  return response.data;
};

const biddingService={
    placebid,
    fetchBiddingHistory,
    sellproductsbyuser,
};

export default biddingService;