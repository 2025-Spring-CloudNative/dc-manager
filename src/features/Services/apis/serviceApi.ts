import axios from "axios";
const apiInstance = axios.create({
  baseURL: "http://140.112.90.36:4000/service",
  headers: {
    "Content-Type": "application/json",
  },
});

// GET all services
export async function getService() {
  try {
    const response = await apiInstance.get("/")
    return response.data
  } catch (error) {
    console.error("Error fetching service data:", error)
    throw error
  }
}