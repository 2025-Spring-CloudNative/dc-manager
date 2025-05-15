import { Navigate, useLocation, Outlet } from "react-router-dom"
import { useAuth } from "@app/providers/AuthProvider"

export function RequireLogin() {
    const user = useAuth()
    const location = useLocation()

    if (user === undefined) {
        // still loading
        return null
    }

    if (user === null) {
        // keep where the user was trying to go
        return <Navigate to="/" state={{ from: location }} replace />
    }

    // user is logged in
    return <Outlet />
}
