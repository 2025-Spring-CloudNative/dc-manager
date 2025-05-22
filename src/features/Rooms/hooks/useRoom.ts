import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getRooms, getRoomById, deleteRoom } from "../apis/room"

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

export function useDeleteRoomMutation() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (id: string) => deleteRoom(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["room"] });
      },
    });
  }
  
