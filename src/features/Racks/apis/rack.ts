import axios from "axios"

const apiInstance = axios.create({
    baseURL: "http://140.112.90.37:4000/rack" ,
    headers: {
        "Content-Type": "application/json",
    },
})

export async function getRacks() {
    try {
        const response = await apiInstance.get("/")
        return response.data
    } catch (error) {
        console.error("Error fetching room data:", error)
        throw error
    }
}
