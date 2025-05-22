import axios from "axios";
// import { IPAdress } from "@/features/IPAddress/types";
const apiInstance = axios.create({
  baseURL: "http://140.112.90.36:4000/ip-address",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

//  GET all IPS 
export async function getIPAddress() {
  try {
    const response = await apiInstance.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching IP data:", error);
    throw error;
  }
}

export async function getIPAddressbypoolId(poolId: number) {
  try {
    const response = await apiInstance.get(`/?poolId=${poolId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching IP data:", error);
    throw error;
  }
}
