import { PropsWithChildren } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@lib/queryClient"
import AuthProvider from "@app/providers/AuthProvider"

export default function AppProviders({ children }: PropsWithChildren) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
                {/* Devtools toggle if needed */}
                {/* {import.meta.env.DEV &&
                (await import("@tanstack/react-query-devtools").then(({ ReactQueryDevtools }) => (
                    <ReactQueryDevtools initialIsOpen={false} />
                )))} */}
            </AuthProvider>
        </QueryClientProvider>
    )
}
