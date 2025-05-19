import axios from "axios";
import { DataCenter } from "../types";
const apiInstance = axios.create({
  baseURL: "http://140.112.90.37:4000/data-center",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getDataCenters() {
  try {
    const response = await apiInstance.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching data center data:", error);
    throw error;
  }
}

export async function getDataCenterById(id: number) {
  try {
    const response = await apiInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data center by ID:", error);
    throw error;
  }
}

export async function createDataCenter(data: DataCenter): Promise<DataCenter> {
  try {
    const response = await apiInstance.post("/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating data center:", error);
    throw error;
  }
}

export async function updateDataCenter(id: string, data: { name: string; location: string }) {
  try {
    const response = await apiInstance.patch(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating data center:", error);
    throw error;
  }
}

export async function deleteDataCenter(id: number) {
  try {
    const response = await apiInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting data center:", error);
    throw error;
  }
}
