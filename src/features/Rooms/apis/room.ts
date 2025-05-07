import axios from "axios"

const apiInstance = axios.create({
    baseURL: "http://140.112.90.37:4000/room" ,
    headers: {
        "Content-Type": "application/json",
    },
})

export async function getRooms() {
    try {
        const response = await apiInstance.get("/")
        return response.data
    } catch (error) {
        console.error("Error fetching room data:", error)
        throw error
    }
}

export async function getRoomById(id: string) {
    try {
        const response = await apiInstance.get(`/${id}`)
        return response.data
    } catch (error) {
        console.error("Error fetching room data:", error)
        throw error
    }
}