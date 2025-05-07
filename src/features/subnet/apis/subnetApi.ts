import api from "@lib/axios"

export async function getSubnets() {
    try {
        const response = await api.get("/subnet")
        return response.data
    } catch (error) {
        console.error("Error fetching subnet data:", error)
        throw error
    }
}
