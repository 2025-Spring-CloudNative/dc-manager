import api from "@/lib/axios"
import { Service, CreateServiceRequest } from "../types"

export async function getService() {
    try {
        const response = await api.get("/service")
        return response.data
    } catch (error) {
        console.error("Error fetching service data:", error)
        throw error
    }
}

export async function getServiceById(id: string) {
    try {
        const response = await api.get(`/service/${id}`)
        return response.data
    } catch (error) {
        console.error("Error fetching service by ID:", error)
        throw error
    }
}

export async function createService(
    data: CreateServiceRequest
): Promise<CreateServiceRequest> {
    try {
        const response = await api.post("/service", data)
        return response.data
    } catch (error) {
        console.error("Error creating service:", error)
        throw error
    }
}

export async function updateService(
    id: number,
    data: Service
): Promise<Service> {
    try {
        const response = await api.patch(`/service/${id}`, data)
        return response.data
    } catch (error) {
        console.error("Error updating service:", error)
        throw error
    }
}

export async function deleteService(id: number): Promise<void> {
    try {
        const response = await api.delete(`/service/${id}`)
        return response.data
    } catch (error) {
        console.error("Error deleting service:", error)
        throw error
    }
}

export async function getServiceFaultRateById(
    id: number
): Promise<{ faultRate: number }> {
    try {
        const response = await api.get(`/service/fault/${id}`)
        return response.data
    } catch (error) {
        console.error("Error fetching rack fault rate:", error)
        throw error
    }
}
