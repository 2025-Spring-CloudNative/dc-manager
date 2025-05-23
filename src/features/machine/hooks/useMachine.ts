import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMachines, getMachineById } from "../apis/machine"

export function useGetMachineQuery() {
    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ["machine"],
        queryFn: getMachines,
    })

    return {
        data,
        isLoading,
        isError,
        isSuccess,
        error,
    }
}

export function useGetMachineByIdQuery(id: string) {
    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ["machine", id],
        queryFn: () => getMachineById(id),
    })

    return {
        data,
        isLoading,
        isError,
        isSuccess,
        error,
    }
}
