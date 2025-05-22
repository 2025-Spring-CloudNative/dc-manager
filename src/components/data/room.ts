export interface Room {
    id:       number;
    name:     string;
    unit:     number;
    dataCenterId: number;
  }


// fetch room data by data center id
import { useGetRoomQuery} from "@/features/Rooms/hooks/useRoom";

export function fetchrooms_datacenterid(dc_id: number) {
  const { data: room, isLoading: isLoading_room, isError: isError_room } = useGetRoomQuery();
  
  if (isLoading_room) {
    console.log("Loading rooms...");
    return [];
  }
  
  if (isError_room) {
    console.error("Error fetching rooms");
    return [];
  }

  return room.filter((room: Room) => dc_id === room.dataCenterId)
}