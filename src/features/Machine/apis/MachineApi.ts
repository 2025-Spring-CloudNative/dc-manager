import axios from "axios"
import { Machine } from "../types"
import api  from "@/lib/axios"

export async function getMachines(): Promise<Machine[]> {
    try {
        const response = await api.get("/machine")
        return response.data
    } catch (error) {
        console.error("Error fetching machine data:", error)
        throw error
    }
}
export async function getMachineById(id: number) {
    try {
        const response = await api.get(`/machine/${id}`)
        return response.data
    } catch (error) {
        console.error("Error fetching machine by ID:", error)
        throw error
    }
}
export async function createMachine(data: Machine): Promise<Machine> {
    try {
        console.log("Creating machine with data:", data)
        const response = await api.post("/machine", data)
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
        const response = await api.patch(`/machine/${id}`, data)
        return response.data
    } catch (error) {
        console.error("Error updating machine:", error)
        throw error
    }
}
export async function deleteMachine(id: number) {
    try {
        const response = await api.delete(`/machine/${id}`)
        return response.data
    } catch (error) {
        console.error("Error deleting machine:", error)
        throw error
    }
}
