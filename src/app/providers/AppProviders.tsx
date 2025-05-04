import { PropsWithChildren } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@lib/queryClient"

export default function AppProviders({ children }: PropsWithChildren) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* Devtools toggle if needed */}
            {/* {import.meta.env.DEV &&
                (await import("@tanstack/react-query-devtools").then(({ ReactQueryDevtools }) => (
                    <ReactQueryDevtools initialIsOpen={false} />
                )))} */}
        </QueryClientProvider>
    )
}
