import axios from "axios";
import { axiosInstance } from "axios";
import { IPPool } from "../types"

const apiInstance = axios.create({
  baseURL: "http://140.112.90.36:4000/ip-pool",
  headers: {
    "Content-Type": "application/json",
  },
});



export async function getIPPool() {
  try {
    const response = await apiInstance.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching ip pool data:", error);
    throw error;
  }
}

export async function getIPPoolById(id: string) {
  try {
    const response = await apiInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ip pool by ID:", error);
    throw error;
  }
}

export async function createIPPool(data: IPPool): Promise<IPPool> {
  try {
    const response = await apiInstance.post("/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating ip pool:", error);
    throw error;
  }
}



export async function updateIPPool(id: string, data: IPPool): Promise<IPPool>  {
  try {
    const response = await apiInstance.patch(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating ip pool:", error);
    throw error;
  }
}

export async function deleteIPPool(id: string): Promise<void>   {
  try {
    const response = await apiInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting ip pool:", error);
    throw error;
  }
}

export async function getIPPoolUtilization(id: string) {
  try {
    const response = await apiInstance.get(`/util/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ip pool utilization by ID:", error);
    throw error;
  }
}




export async function extendIPPool(id: string) {
  try {
    const response = await apiInstance.patch(`/extend/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error extending ip pool by ID:", error);
    throw error;
  }
}
