import { useQuery } from "@tanstack/react-query"
import { getSubnets } from "../apis/subnetApi"

export function useGetSubnetsQuery() {
    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ["subnet"],
        queryFn: getSubnets,
    })

    return {
        data,
        isLoading,
        isError,
        isSuccess,
        error,
    }
}
