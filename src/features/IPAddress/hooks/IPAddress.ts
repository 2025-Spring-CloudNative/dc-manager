import { useQuery } from "@tanstack/react-query"
import {
    getIPAddress,
    getIPAddressbypoolId,
    getIPAddressbymachineId,
} from "../apis/IPAddress"
import { IPAddress } from "../types"

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

// get by machineId
export function useGetIPAddressbymachineIdQuery(machineID: number) {
    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ["ip-machine", machineID],
        queryFn: () => getIPAddressbymachineId(machineID),
        enabled: !!machineID,
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
    const {
        data: allIPs,
        isLoading,
        isError,
        isSuccess,
        error,
    } = useGetIPAddressQuery()

    const data = allIPs?.filter((ip: IPAddress) => ip.poolId === poolID)

    return {
        data,
        isLoading,
        isError,
        isSuccess,
        error,
    }
}

//add
export function getlocalIPAddressbyMachineID(machineID: number) {
    const {
        data: allIPs,
        isLoading,
        isError,
        isSuccess,
        error,
    } = useGetIPAddressQuery()

    const data = allIPs?.filter((ip: IPAddress) => ip.machineId === machineID)

    return {
        data,
        isLoading,
        isError,
        isSuccess,
        error,
    }
}
