import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRooms, getRoomById, createRoom, updateRoom, deleteRoom } from "../apis/room"
import { Room } from "../types"
export function useGetRoomQuery() {
    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ["room"],
        queryFn: getRooms,
    })

    return {
        data,
        isLoading,
        isError,
        isSuccess,
        error,
    }
}

export function useGetRoomByIdQuery(id: string) {
    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ["room", id],
        queryFn: () => getRoomById(id),
    })

    return {
        data,
        isLoading,
        isError,
        isSuccess,
        error,
    }
}

// add room
export function useAddRoomMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: { name: string; unit: number; dataCenterId: number }) => createRoom(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["room"] })
        },
    })
}
export function useUpdateRoomMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: { id: string;[key: string]: any }) => updateRoom(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["room"] });
        },
    });
}

export function useDeleteRoomMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteRoom(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["room"] })
        },
    })
}