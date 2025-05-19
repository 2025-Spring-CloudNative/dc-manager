import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRooms, getRoomById, createRoom } from "../apis/room"

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
        mutationFn: (data: { name: string; unit: number; dataCenterId: number}) => createRoom(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["room"] })
        },
    })
}
