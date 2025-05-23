import axios from "axios"

const apiInstance = axios.create({
    baseURL: "http://140.112.90.36:4000/machine" ,
    headers: {
        "Content-Type": "application/json",
    },
})

export async function getMachines() {
    try {
        const response = await apiInstance.get("/")
        return response.data
    } catch (error) {
        console.error("Error fetching machine data:", error)
        throw error
    }
}

export async function getMachineById(id: string) {
    try {
        const response = await apiInstance.get(`/${id}`)
        return response.data
    } catch (error) {
        console.error("Error fetching machine data:", error)
        throw error
    }
}