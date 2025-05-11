export type UserRole = "admin" | "user" | "guest"

export type User = {
    id?: string
    name: string
    email: string
    // password?: string
    role: UserRole
}

export type UserWithPassword = User & {
    password: string
}
