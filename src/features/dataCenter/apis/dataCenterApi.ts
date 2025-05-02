import axios from "axios"

const apiInstance = axios.create({
    baseURL: "http://localhost:4000/data-center",
    headers: {
        "Content-Type": "application/json",
    },
})

export async function getDataCenter() {
    try {
        const response = await apiInstance.get("/")
        return response.data
    } catch (error) {
        console.error("Error fetching data center data:", error)
        throw error
    }
}
