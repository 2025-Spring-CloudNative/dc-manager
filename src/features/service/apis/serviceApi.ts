import axios from "axios";

const apiInstance = axios.create({
  baseURL: "http://140.112.90.36:4000/service",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getServices() {
  try {
    const response = await apiInstance.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching service data:", error);
    throw error;
  }
}

export async function getServiceById(id: string) {
  try {
    const response = await apiInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching service by ID:", error);
    throw error;
  }
}

export async function createService(data: {
  service: { id: string; name: string };
  poolId: string;
}) {
  try {
    const response = await apiInstance.post("/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
}

export async function updateService(id: string, data: { name: string; location: string }) {
  try {
    const response = await apiInstance.patch(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
}

export async function deleteService(id: string) {
  try {
    const response = await apiInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
}
