import { useQuery } from "@tanstack/react-query";
import {
  getService,
} from "../apis/serviceApi";


// All
export function useGetServicesQuery() {
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["service"],
    queryFn: getService,
  })

  return {
    data,
    isLoading,
    isError,
    isSuccess,
    error,
  }
}
