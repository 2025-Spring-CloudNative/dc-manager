import api from "@lib/axios"
import type { User, UserWithPassword } from "../types"

type LoginResponse = {
    accessToken: string
    user: User
}

// the result will be fetched and cached first in AuthProvider
export async function getSession(): Promise<User> {
    try {
        const response = await api.get("/auth/session")
        return response.data
    } catch (error) {
        console.error("Error fetching session data:", error)
        throw error
    }
}

export async function userLogin(creds: {
    email: string
    password: string
}): Promise<LoginResponse> {
    try {
        const response = await api.post("/auth/login", creds)
        return response.data
    } catch (error) {
        console.error("Error logging in:", error)
        throw error
    }
}

export async function userLogout(): Promise<void> {
    try {
        await api.delete("/auth/logout")
    } catch (error) {
        console.error("Error logging out:", error)
        throw error
    }
}

export async function userRegister(
    creds: UserWithPassword
): Promise<LoginResponse> {
    try {
        const response = await api.post("/auth/register", creds)
        return response.data
    } catch (error) {
        console.error("Error registering:", error)
        throw error
    }
}

type UpdateUserInfoVariables = {
    userId: number
    userData: Partial<User>
}

export async function updateUserInfo({
    userId,
    userData,
}: UpdateUserInfoVariables): Promise<User> {
    try {
        const response = await api.patch(`/user/${userId}`, userData)
        return response.data
    } catch (error) {
        console.error("Error updating user info:", error)
        throw error
    }
}

type updateUserPasswordVariables = {
    userId: number
    passwordData: { oldPassword: string; newPassword: string }
}

export async function updateUserPassword({
    userId,
    passwordData,
}: updateUserPasswordVariables) {
    try {
        const response = await api.patch(
            `/user/reset-password/${userId}`,
            passwordData
        )
        return response.data
    } catch (error) {
        console.error("Error updating user password:", error)
        throw error
    }
}
