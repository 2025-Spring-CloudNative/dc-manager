import axios from "axios"
import { Subnet } from "@/features/subnet/types"
import api from "@/lib/axios"

// GET all subnets
export async function getSubnets(): Promise<Subnet[]> {
    try {
        const response = await api.get("/subnet")
        return response.data
    } catch (error) {
        console.error("Error fetching subnet data:", error)
        throw error
    }
}

// GET a single subnet by ID
export async function getSubnetById(id: number) {
    try {
        const response = await api.get(`/subnet/${id}`)
        return response.data
    } catch (error) {
        console.error("Error fetching subnet by ID:", error)
        throw error
    }
}

// Get subnet utilization by ID
export async function getSubnetUtilization(id: number) {
  try {
    const response = await api.get(`/subnet/util/${id}`);
    // console.log("Subnet Utilization Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching ip pool utilization by ID:", error);
    throw error;
  }
}

// CREATE a subnet
export async function createSubnet(data: Subnet): Promise<Subnet> {
    try {
        const response = await api.post("/subnet", data)
        return response.data
    } catch (error) {
        console.error("Error creating subnet:", error)
        throw error
    }
}

// UPDATE a subnet
export async function updateSubnet(id: string, data: Subnet): Promise<Subnet> {
    try {
        const response = await api.patch(`/subnet/${id}`, data)
        return response.data
    } catch (error) {
        console.error("Error updating subnet:", error)
        throw error
    }
}

// DELETE a subnet
export async function deleteSubnet(id: string): Promise<void> {
    try {
        const response = await api.delete(`/${id}`)
        return response.data
    } catch (error) {
        console.error("Error deleting subnet:", error)
        throw error
    }
}
