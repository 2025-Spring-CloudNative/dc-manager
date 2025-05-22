import { useQuery} from "@tanstack/react-query";
import {
  getIPs,
  getIPPoolbysubnetId
} from "../apis/IPPoolApi";
import { IP } from "@/features/IPPool/types";
// All
export function useGetIPPoolQuery() {
    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ["ip-pool"],
        queryFn: getIPs,
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
    const { data: allIPs, isLoading, isError, isSuccess, error } = useGetIPPoolQuery();

    const data = allIPs?.filter((ip: IP) => ip.subnet_id === subnetId);

    return {
      data,
      isLoading,
      isError,
      isSuccess,
      error,
    }
}

