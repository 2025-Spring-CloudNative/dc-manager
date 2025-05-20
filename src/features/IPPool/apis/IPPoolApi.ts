import axios from "axios";
import { IP } from "@/features/IPPool/types";
const apiInstance = axios.create({
  baseURL: "http://140.112.90.37:4000/ip-pool",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

//  GET all IPS 
export async function getIPs() {
  try {
    const response = await apiInstance.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching IP data:", error);
    throw error;
  }
}

export async function getIPPoolbysubnetId(subnetId: number) {
  try {
    const response = await apiInstance.get(`/?subnetId=${subnetId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching IP data:", error);
    throw error;
  }
}
