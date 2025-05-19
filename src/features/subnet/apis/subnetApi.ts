import axios from "axios";
import { Subnet } from "@/features/subnet/types";
const apiInstance = axios.create({
  baseURL: "http://140.112.90.37:4000/subnet",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// GET all subnets
export async function getSubnets() {
    try {
        const response = await apiInstance.get("/")
        return response.data
    } catch (error) {
        console.error("Error fetching subnet data:", error)
        throw error
    }
}

// GET a single subnet by ID
export async function getSubnetById(id: number) {
  try {
    const response = await apiInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subnet by ID:", error);
    throw error;
  }
}


// CREATE a subnet
export async function createSubnet(data: Subnet): Promise<Subnet> {
  const response = await apiInstance.post("/", data);
  return response.data;
}

// UPDATE a subnet
export async function updateSubnet(id: string, data: Subnet): Promise<Subnet> {
  const response = await apiInstance.patch(`/${id}`, data);
  return response.data;
}

// DELETE a subnet
export async function deleteSubnet(id: string): Promise<void> {
  await apiInstance.delete(`/${id}`);
}
