import axios from "axios"
import { IPPool } from "@/features/IPPool/types"
import api from "@/lib/axios"
//  GET all IPS
export async function getIPPools(): Promise<IPPool[]> {
    try {
        const response = await api.get("/ip-pool")
        return response.data
    } catch (error) {
        console.error("Error fetching IP data:", error)
        throw error
    }
}

export async function getIPPoolbysubnetId(subnetId: number) {
    try {
        const response = await api.get(`/ip-pool/?subnetId=${subnetId}`)
        return response.data
    } catch (error) {
        console.error("Error fetching IP data:", error)
        throw error
    }
}
