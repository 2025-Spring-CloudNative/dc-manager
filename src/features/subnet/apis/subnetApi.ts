import axios from "axios"

const apiInstance = axios.create({
    baseURL: "http://localhost:4000/subnet",
    headers: {
        "Content-Type": "application/json",
    },
})

export async function getSubnets() {
    try {
        const response = await apiInstance.get("/")
        return response.data
    } catch (error) {
        console.error("Error fetching subnet data:", error)
        throw error
    }
}
