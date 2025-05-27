import api from "@lib/axios"
import { DataCenter } from "../types"

export type DataCenterFilters = {
    name?: string // /data-centers?name=…
    location?: string // /data-centers?location=…
    sortBy?: "name" | "location" // ?sortBy=
    sortOrder?: "asc" | "desc" // ?sortOrder=
}

export async function getDataCenters(filters: DataCenterFilters = {}) {
    try {
        const params = new URLSearchParams()
        if (filters.name) params.append("name", filters.name)
        if (filters.location) params.append("location", filters.location)
        if (filters.sortBy) params.append("sortBy", filters.sortBy)
        if (filters.sortOrder) params.append("sortOrder", filters.sortOrder)

        const response = await api.get(`/data-center?${params.toString()}`)
        return response.data
    } catch (error) {
        console.error("Error fetching data center data:", error)
        throw error
    }
}

export async function getDataCenterById(id: number): Promise<DataCenter> {
    try {
        const response = await api.get(`/data-center/${id}`)
        return response.data
    } catch (error) {
        console.error("Error fetching data center by ID:", error)
        throw error
    }
}

export async function getDataCenterBySubnetID(subnetId: number) {
    try {
        const response = await api.get(`/data-center/?subnetId=${subnetId}`)
        console.log("Data center by subnet ID:", response.data, subnetId)
        return response.data
    } catch (error) {
        console.error("Error fetching data center by subnet ID:", error)
        throw error
    }
}

export type CreateDataCenterData = {
    dataCenter: Omit<DataCenter, "id">
    subnetId?: number
}

export async function createDataCenter(
    data: CreateDataCenterData
): Promise<DataCenter> {
    try {
        const response = await api.post("/data-center", data)
        return response.data
    } catch (error) {
        console.error("Error creating data center:", error)
        throw error
    }
}

export type UpdateDataCenterData = {
    id: number
    data: Partial<DataCenter>
}

export async function updateDataCenter({
    id,
    data,
}: UpdateDataCenterData): Promise<DataCenter> {
    try {
        const response = await api.patch(`/data-center/${id}`, data)
        return response.data
    } catch (error) {
        console.error("Error updating data center:", error)
        throw error
    }
}

export async function deleteDataCenter(id: number) {
    try {
        const response = await api.delete(`/data-center/${id}`)
        return response.data
    } catch (error) {
        console.error("Error deleting data center:", error)
        throw error
    }
}
