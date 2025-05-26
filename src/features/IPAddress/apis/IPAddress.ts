import { IPAddress } from "../types"
// import { IPAdress } from "@/features/IPAddress/types";
import api from "@/lib/axios"

//  GET all IPS
export async function getIPAddress(): Promise<IPAddress[]> {
    try {
        const response = await api.get("/ip-address")
        return response.data
    } catch (error) {
        console.error("Error fetching IP data:", error)
        throw error
    }
}

export async function getIPAddressbypoolId(poolId: number) {
    try {
        const response = await api.get(`/ip-address/?poolId=${poolId}`)
        return response.data
    } catch (error) {
        console.error("Error fetching IP data:", error)
        throw error
    }
}
