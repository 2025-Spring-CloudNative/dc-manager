import {
    createContext,
    useContext,
    useState,
    useEffect,
    useLayoutEffect,
    PropsWithChildren,
} from "react"
import type { InternalAxiosRequestConfig } from "axios"
import { useQueryClient } from "@tanstack/react-query"

import api from "@lib/axios"
import type { User } from "@features/user/types"

type InternalAxiosRequestConfigWithRetry = InternalAxiosRequestConfig & {
    _retry?: boolean
}

/* 
    token/user can be:
    * undefined: haven't fetched yet
    * null: not logged in / unauthenticated
    * string: logged in / authenticated
*/
type TAuthContext = {
    accessToken?: string | null
    currentUser?: User | null
    setAccessToken: (value: string | null) => void
}

const AuthContext = createContext<TAuthContext | undefined>(undefined)

export function useAuth() {
    const authContext = useContext(AuthContext)

    if (!authContext) {
        throw new Error("useAuth must be used within an AuthProvider")
    }

    return authContext
}

function AuthProvider({ children }: PropsWithChildren) {
    const queryClient = useQueryClient()
    const [token, setToken] = useState<string | null>()
    const [currentUser, setCurrentUser] = useState<User | null>()

    // bootstrap: fetch access token using cookie's refresh token
    useEffect(() => {
        async function fetchToken() {
            try {
                const response = await api.get("/auth/refresh")

                const { accessToken, user } = response.data

                setToken(accessToken)
                setCurrentUser(user)
                queryClient.setQueryData(["session"], user) // this will make sure useSession is cached
            } catch {
                setToken(null)
                setCurrentUser(null)
                queryClient.clear()
            }
        }

        fetchToken()
    }, [])

    // request interceptor
    useLayoutEffect(() => {
        const authInterceptor = api.interceptors.request.use((config) => {
            const cfg = config as InternalAxiosRequestConfigWithRetry
            if (!cfg._retry && token)
                config.headers.Authorization = `Bearer ${token}`

            return config
        })

        return () => {
            api.interceptors.request.eject(authInterceptor)
        }
    }, [token])

    // response interceptor
    useLayoutEffect(() => {
        const refreshInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest =
                    error.config as InternalAxiosRequestConfigWithRetry

                if (
                    error.response.status === 401 &&
                    error.response.data.message === "Unauthorized" &&
                    !originalRequest._retry // only retry once
                ) {
                    try {
                        originalRequest._retry = true

                        const response = await api.get("/auth/refresh")
                        const { accessToken } = response.data
                        setToken(accessToken)

                        originalRequest.headers.Authorization = `Bearer ${accessToken}`

                        return api(originalRequest)
                    } catch (error) {
                        console.error("Response Interceptor Error:", error)
                        setToken(null)
                        setCurrentUser(null)
                        queryClient.clear()
                    }
                }
                return Promise.reject(error)
            }
        )

        return () => {
            api.interceptors.response.eject(refreshInterceptor)
        }
    }, [])

    return (
        <AuthContext.Provider
            value={{
                accessToken: token,
                currentUser,
                setAccessToken: setToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
