import { useQuery } from "@tanstack/react-query"
import { getRooms, getRoomById } from "../apis/room"

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
