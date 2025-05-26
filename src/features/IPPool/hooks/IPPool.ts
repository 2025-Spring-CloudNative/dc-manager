import { useQuery } from "@tanstack/react-query"
import { getIPPools, getIPPoolbysubnetId } from "../apis/IPPoolApi"
import { IPPool } from "../types"

// All
export function useGetIPPoolQuery() {
    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ["ip-pool"],
        queryFn: getIPPools,
    })

    return {
        data,
        isLoading,
        isError,
        isSuccess,
        error,
    }
}

// filter by subnetId
export function useGetIPPoolbysubnetIdQuery(subnetId: number) {
    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ["ip-pool", subnetId],
        queryFn: () => getIPPoolbysubnetId(subnetId),
    })
    return {
        data,
        isLoading,
        isError,
        isSuccess,
        error,
    }
}

// filter on all IPs by subnetId
export function getlocalIPPoolbysubnetId(subnetId: number) {
    const {
        data: allIPs,
        isLoading,
        isError,
        isSuccess,
        error,
    } = useGetIPPoolQuery()

    const data = allIPs?.filter((ip: IPPool) => ip.subnet_id === subnetId)

    return {
        data,
        isLoading,
        isError,
        isSuccess,
        error,
    }
}
