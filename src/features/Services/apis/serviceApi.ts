
import type { Service } from "../types"
import api from "@/lib/axios"

// GET all services
export async function getService(): Promise<Service[]> {
    try {
        const response = await api.get("/service")
        return response.data
    } catch (error) {
        console.error("Error fetching service data:", error)
        throw error
    }
}
