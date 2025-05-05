import { useQuery } from "@tanstack/react-query"
import { getDataCenters } from "../apis/dataCenterApi"

export function useGetDataCentersQuery() {
    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ["dataCenter"],
        queryFn: getDataCenters,
    })

    return {
        data,
        isLoading,
        isError,
        isSuccess,
        error,
    }
}
