import { Rack } from "../types"

import api from "@/lib/axios"

export async function getRacks(): Promise<Rack[]> {
    try {
        const response = await api.get("/rack/")
        return response.data
    } catch (error) {
        console.error("Error fetching rack data:", error)
        throw error
    }
}

export async function getRackById(id: number) {
    try {
        const response = await api.get(`/rack/${id}`)
        return response.data
    } catch (error) {
        console.error("Error fetching rack data:", error)
        throw error
    }
}
export async function createRack(data: Rack): Promise<Rack> {
    try {
        const response = await api.post("/rack/", data)
        return response.data
    } catch (error) {
        console.error("Error creating rack:", error)
        throw error
    }
}

export async function updateRack(
    id: number,
    data: Partial<Rack>
): Promise<Rack> {
    try {
        const response = await api.patch(`/rack/${id}`, data)
        return response.data
    } catch (error) {
        console.error("Error updating rack:", error)
        throw error
    }
}
export async function deleteRack(id: number): Promise<void> {
    try {
        await api.delete(`/rack/${id}`)
    } catch (error) {
        console.error("Error deleting rack:", error)
        throw error
    }
}
