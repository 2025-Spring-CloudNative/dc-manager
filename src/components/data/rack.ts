

export interface Rack {
    id:         number;
    serviceid:  number;
    name:       string;
    height:     number;
    tag:        string;
    roomId:     number;
    createdAt:  string;
    updatedAt:  string;
  }


// fetch rack data by room id
import { useGetRackQuery} from "@/features/Racks/hooks/useRack";
// import { Room } from "@/components/data/room";

export function fetchrack() {
  const { data: rack, isLoading: isLoading_rack, isError: isError_rack } = useGetRackQuery();
  if (isLoading_rack) {
    console.log("Loading racks...");
    return [];
  }
  if (isError_rack) {
    console.error("Error fetching racks");
    return [];
  }
  return rack
}

export function fetchracks_roomid(room_id: number) {
  const { data: rack, isLoading: isLoading_rack, isError: isError_rack } = useGetRackQuery();
  
  if (isLoading_rack) {
    console.log("Loading racks...");
    return [];
  }
  
  if (isError_rack) {
    console.error("Error fetching racks");
    return [];
  }

  return rack.filter((rack: Rack) => room_id === rack.roomId)
}