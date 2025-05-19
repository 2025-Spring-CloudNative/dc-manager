import { useQuery, useMutation, useQueryClient  } from "@tanstack/react-query"
import { getRacks, getRackById,createRack,updateRack,deleteRack} from "../apis/rack"
import { Rack } from "../types"
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
export function useGetRackByIdQuery(id: string) {
    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ["rack", id],
        queryFn: () => getRackById(id),
    })

    return {
        data,
        isLoading,
        isError,
        isSuccess,
        error,
    }
}

export function useAddRackMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Rack) => createRack(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rack"] })
        },
    })
}
export function useUpdateRackMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({id,data}: {id:string, data: Rack}) => updateRack(id,data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rack"] })
        },
    })
}
export function useDeleteRackMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteRack(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rack"] })
        },
    })
}