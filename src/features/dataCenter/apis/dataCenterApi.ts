import api from "@lib/axios"

export async function getDataCenters() {
    try {
        const response = await api.get("/data-center")
        return response.data
    } catch (error) {
        console.error("Error fetching data center data:", error)
        throw error
    }
}
