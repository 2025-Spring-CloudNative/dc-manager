import { useQuery } from "@tanstack/react-query"
import { getDataCenter } from "../apis/dataCenterApi"

export function useDataCenterQuery() {
    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ["dataCenter"],
        queryFn: getDataCenter,
    })

    return {
        data,
        isLoading,
        isError,
        isSuccess,
        error,
    }
}
