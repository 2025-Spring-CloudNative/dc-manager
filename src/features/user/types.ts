export type UserRole = "admin" | "user"

export type User = {
    id?: string
    name: string
    email: string
    // passwordHash?: string
    role: UserRole
    createdAt?: Date
    updatedAt?: Date
}

export type UserWithPassword = User & {
    password: string
}
