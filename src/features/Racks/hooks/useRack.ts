import { useQuery } from "@tanstack/react-query"
import { getRacks } from "../apis/rack"

export function useGetRackQuery() {
    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ["rack"],
        queryFn: getRacks,
    })

    return {
        data,
        isLoading,
        isError,
        isSuccess,
        error,
    }
}
