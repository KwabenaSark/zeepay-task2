import { API_BASE_URL } from '../config';

import axios from "axios"



/**
 * GET /Dashboard 
 */

export const fetchStats = async () => {
  if (!API_BASE_URL) {
    throw new Error("SET API");
  }

  const res = await axios.get(`${API_BASE_URL}/api/stat`);
  return res.data;
};




/**
 * GET /List data
 */

export const fetchList = async () => {
  if (!API_BASE_URL) {
    throw new Error("SET API");
  }

  const res = await axios.get(`${API_BASE_URL}/api/items`);
  return res.data;
};


/**
 * POST /applications — body shape should match your backend.
 */
export async function addList(body) {
  if (!API_BASE_URL) {
    throw new Error("SET API");
  }
  const { data } = await axios.post(`${API_BASE_URL}/api/items`, body);
  return data;
}


//Extra; Delet

export async function deleteList(id) {

  await axios.delete(`${API_BASE_URL}/api/items`, { data: { id } });
  
}
