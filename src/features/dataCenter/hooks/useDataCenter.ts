import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDataCenters,
  getDataCenterById,
  createDataCenter,
  updateDataCenter,
  deleteDataCenter,
} from "../apis/dataCenterApi";

// Get all
export function useGetDataCentersQuery() {
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["dataCenter"],
    queryFn: getDataCenters,
  });

  return {
    data,
    isLoading,
    isError,
    isSuccess,
    error,
  };
}

// Get by ID
export function useGetDataCenterByIdQuery(id: number) {
  return useQuery({
    queryKey: ["dataCenter", id],
    queryFn: () => getDataCenterById(id),
    enabled: !!id,
  });
}

// Create
export function useCreateDataCenterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      dataCenter: { name: string; location: string };
      subnetId?: string;
    }) => createDataCenter({
      dataCenter: data.dataCenter,
      subnetId: data.subnetId ?? ""
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dataCenter"] });
    },
  });
}

// Update
export function useUpdateDataCenterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; location: string } }) =>
      updateDataCenter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dataCenter"] });
    },
  });
}

// Delete
export function useDeleteDataCenterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteDataCenter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dataCenter"] });
    },
  });
}
