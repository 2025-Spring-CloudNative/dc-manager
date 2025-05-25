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
    passwordHash: string
}

export function mapRoleToString(role: UserRole | undefined) {
    switch (role) {
        case "admin":
            return "管理員"
        case "user":
            return "使用者"
        default:
            return undefined
    }
}
