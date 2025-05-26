import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    getService,
    getServiceById,
    createService,
    updateService,
    deleteService,
} from "../apis/serviceApi"
import { Service, CreateServiceRequest } from "../types"

// Get all
export function useGetServicesQuery() {
    const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
        queryKey: ["service"],
        queryFn: getService,
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

// Get by ID
export function useGetServiceByIdQuery(id: string) {
    return useQuery({
        queryKey: ["service", id],
        queryFn: () => getServiceById(id),
        enabled: !!id,
    })
}

// Create
export function useCreateServiceMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateServiceRequest) => createService(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["service"] })
        },
    })
}

// Update
export function useUpdateServiceMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Service) => updateService(data.id!.toString(), data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["service"] })
        },
    })
}

// Delete
export function useDeleteServiceMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => deleteService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["service"] })
        },
    })
}
