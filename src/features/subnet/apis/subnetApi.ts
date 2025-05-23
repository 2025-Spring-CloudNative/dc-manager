import api from "@lib/axios"
import { Subnet } from "@features/subnet/types"

// GET all subnets
export async function getSubnets() {
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

// CREATE a subnet
export async function createSubnet(data: Subnet): Promise<Subnet> {
    const response = await api.post("/subnet", data)
    return response.data
}

// UPDATE a subnet
export async function updateSubnet(id: string, data: Subnet): Promise<Subnet> {
    const response = await api.patch(`/subnet/${id}`, data)
    return response.data
}

// DELETE a subnet
export async function deleteSubnet(id: string): Promise<void> {
    await api.delete(`/subnet/${id}`)
}
