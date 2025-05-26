import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    getSubnets,
    getSubnetById,
    getSubnetUtilization,
    createSubnet,
    updateSubnet,
    deleteSubnet,
} from "../apis/subnetApi"
import { Subnet } from "@/features/subnet/types"

// All
export function useGetSubnetsQuery() {
    const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
        queryKey: ["subnet"],
        queryFn: getSubnets,
    })

    return {
        data,
        isLoading,
        isError,
        isSuccess,
        error,
        refetch,
    }
}

// Single
export function useGetSubnetByIdQuery(id: number) {
    return useQuery({
        queryKey: ["subnet", id],
        queryFn: () => getSubnetById(id),
        enabled: Number.isInteger(id),
    })
}

// Create
export function useCreateSubnetMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createSubnet,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subnet"] })
        },
    })
}

// Update
export function useUpdateSubnetMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Subnet }) =>
            updateSubnet(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subnet"] })
        },
    })
}

// Delete
export function useDeleteSubnetMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => deleteSubnet(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subnet"] })
        },
    })
}

// Get subnet utilization
export function useGetSubnetUtilizationQuery(id: number) {
    return useQuery({
        queryKey: ["subnetUtilization", id],
        queryFn: () => getSubnetUtilization(id),
        enabled: Number.isInteger(id),
    })
}
