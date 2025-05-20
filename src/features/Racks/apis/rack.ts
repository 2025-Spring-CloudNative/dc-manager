import axios from "axios"
import { Rack } from "../types"

const apiInstance = axios.create({
    baseURL: "http://140.112.90.37:4000/rack",
    headers: {
        "Content-Type": "application/json",
    },
})

export async function getRacks() {
    try {
        const response = await apiInstance.get("/")
        return response.data
    } catch (error) {
        console.error("Error fetching rack data:", error)
        throw error
    }
}

export async function getRackById(id: number) {
    try {
        const response = await apiInstance.get(`/${id}`)
        return response.data
    } catch (error) {
        console.error("Error fetching rack data:", error)
        throw error
    }
}
export async function createRack(data: Rack): Promise<Rack> {
    try {
        const response = await apiInstance.post("/", data)
        return response.data
    } catch (error) {
        console.error("Error creating rack:", error)
        throw error
    }
}

export async function updateRack(id: number, data: Rack): Promise<Rack> {
    try {
        const response = await apiInstance.patch(`/${id}`, data)
        return response.data
    } catch (error) {
        console.error("Error updating rack:", error)
        throw error
    }
}
export async function deleteRack(id: number): Promise<void> {
    try {
        await apiInstance.delete(`/${id}`)
    } catch (error) {
        console.error("Error deleting rack:", error)
        throw error
    }
}