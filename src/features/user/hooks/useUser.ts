import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "@app/providers/AuthProvider"
import {
    getSession,
    userLogin,
    userLogout,
    userRegister,
    updateUserInfo,
    updateUserPassword,
} from "../apis/userApi"

// session
export const useSession = () => {
    const { accessToken } = useAuth()
    const isQueryEnabled = !!accessToken // run only when logged-in

    const query = useQuery({
        queryKey: ["session"],
        queryFn: getSession,
        enabled: isQueryEnabled,
    })

    // Normalize: undefined (not run) => null (not logged in)
    const user = isQueryEnabled ? query.data : null
    const isLoggedIn = !!user

    return { ...query, data: user, isLoggedIn }
}

/*
For both login and register, we will obtain the access token and user data in response data. (in memory)
While refresh token will be stored in cookie.
    * Http-only: true
    * Secure: true (false when using http)
    * SameSite: "None" (backend is on a different domain, cross-origin) 
*/

// Login
export const useLoginMutation = () => {
    const { setAccessToken } = useAuth()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: userLogin,
        onSuccess: ({ accessToken, user }) => {
            setAccessToken(accessToken)
            queryClient.setQueryData(["session"], user)
        },
    })
}

// Logout
export const useLogoutMutation = () => {
    const { setAccessToken } = useAuth()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: userLogout,
        onSuccess: () => {
            setAccessToken(null)
            queryClient.clear() // drop all server state
        },
    })
}

// Register
export const useRegisterMutation = () => {
    const { setAccessToken } = useAuth()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: userRegister,
        onSuccess: ({ accessToken, user }) => {
            setAccessToken(accessToken)
            queryClient.setQueryData(["session"], user)
        },
    })
}

// Update user info
export const useUpdateUserInfoMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateUserInfo,
        onSuccess: (user) => {
            queryClient.setQueryData(["session"], user)
        },
    })
}

// Reset user password
export const useResetUserPasswordMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateUserPassword,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["session"] }) // refresh session data
        },
    })
}
