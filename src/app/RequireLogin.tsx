import { Navigate, useLocation, Outlet } from "react-router-dom"
import { useSession } from "@features/user/hooks/useUser"

export function RequireLogin() {
    const { data: user } = useSession()
    const location = useLocation()

    if (user === undefined) {
        // still loading
        return null
    }

    if (user === null) {
        // keep where the user was trying to go
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // user is logged in
    return <Outlet />
}

export default RequireLogin
