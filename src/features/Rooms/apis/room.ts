import { Room } from "../types"
import api from "@/lib/axios"

export async function getRooms(): Promise<Room[]> {
    try {
        const response = await api.get("/room")
        return response.data
    } catch (error) {
        console.error("Error fetching room data:", error)
        throw error
    }
}

export async function getRoomById(id: string) {
    try {
        const response = await api.get(`/room/${id}`)
        return response.data
    } catch (error) {
        console.error("Error fetching room data:", error)
        throw error
    }
}

export async function createRoom(data: Room): Promise<Room> {
    try {
        const response = await api.post("/room/", data)
        return response.data
    } catch (error) {
        console.error("Error creating room:", error)
        throw error
    }
}
export async function updateRoom(
    id: number,
    data: Partial<Room>
): Promise<Room> {
    try {
        const response = await api.patch(`/room/${id}`, data)
        return response.data
    } catch (error) {
        console.error("Error updating room:", error)
        throw error
    }
}
export async function deleteRoom(id: number): Promise<void> {
    try {
        await api.delete(`/room/${id}`)
    } catch (error) {
        console.error("Error deleting room:", error)
        throw error
    }
}
