import axios from "axios"
import { Machine } from "../types"
const apiInstance = axios.create({
    baseURL: "http://140.112.90.36:4000/machine",
    headers: {
        "Content-Type": "application/json",
    },
})

export async function getMachines(): Promise<Machine[]> {
    try {
        const response = await apiInstance.get("/")
        return response.data
    } catch (error) {
        console.error("Error fetching machine data:", error)
        throw error
    }
}
export async function getMachineById(id: number) {
    try {
        const response = await apiInstance.get(`/${id}`)
        return response.data
    } catch (error) {
        console.error("Error fetching machine by ID:", error)
        throw error
    }
}
export async function createMachine(data: Machine): Promise<Machine> {
    try {
        console.log("Creating machine with data:", data)
        const response = await apiInstance.post("/", data)
        return response.data
    } catch (error) {
        console.error("Error creating machine:", error)
        throw error
    }
}
export async function updateMachine(
    id: number,
    data: Machine
): Promise<Machine> {
    try {
        console.log("Updating machine with ID:", id, "and data:", data)
        delete data.id // Remove id from data to avoid sending it in the body
        delete data.createdAt // Remove createdAt from data to avoid sending it in the body
        const response = await apiInstance.patch(`/${id}`, data)
        return response.data
    } catch (error) {
        console.error("Error updating machine:", error)
        throw error
    }
}
export async function deleteMachine(id: number) {
    try {
        const response = await apiInstance.delete(`/${id}`)
        return response.data
    } catch (error) {
        console.error("Error deleting machine:", error)
        throw error
    }
}
