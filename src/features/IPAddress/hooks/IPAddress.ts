import { useQuery} from "@tanstack/react-query";
import {
  getIPAddress,
  getIPAddressbypoolId
} from "../apis/IPAddress";
import { IP } from "@/features/IPPool/types";
import { IPAdress } from "../types";
// All
export function useGetIPAddressQuery() {
    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ["ipaddress"],
        queryFn: getIPAddress,
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
export function useGetIPAddressbypoolIdQuery(poolID: number) {
    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ["ip-pool", poolID],
        queryFn: () => getIPAddressbypoolId(poolID),
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
export function getlocalIPAddressbypoolID(poolID: number) {
    const { data: allIPs, isLoading, isError, isSuccess, error } = useGetIPAddressQuery();

    const data = allIPs?.filter((ip: IPAdress) => ip.poolId === poolID);

    return {
      data,
      isLoading,
      isError,
      isSuccess,
      error,
    }
}

export function getlocalIPAddressbyMachineID(machineID: number) {
    const { data: allIPs, isLoading, isError, isSuccess, error } = useGetIPAddressQuery();

    const data = allIPs?.filter((ip: IPAdress) => ip.machineId === machineID);

    return {
      data,
      isLoading,
      isError,
      isSuccess,
      error,
    }
}
