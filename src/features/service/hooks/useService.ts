import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../apis/serviceApi";

// Get all
export function useGetServicesQuery() {
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["service"],
    queryFn: getServices,
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
export function useGetServiceByIdQuery(id: string) {
  return useQuery({
    queryKey: ["service", id],
    queryFn: () => getServiceById(id),
    enabled: !!id,
  });
}

// Create
export function useCreateServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      service: { name: string; location: string };
      subnetCidr: string;
    }) => createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service"] });
    },
  });
}

// Update
export function useUpdateServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; location: string } }) =>
      updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service"] });
    },
  });
}

// Delete
export function useDeleteServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service"] });
    },
  });
}
