import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSubnets,
  getSubnetById,
  createSubnet,
  updateSubnet,
  deleteSubnet,
} from "../apis/subnetApi";
import { Subnet } from "@/features/subnet/types";

// All
export function useGetSubnetsQuery() {
    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ["subnet"],
        queryFn: getSubnets,
    })

    return {
        data,
        isLoading,
        isError,
        isSuccess,
        error,
    }
}

// Single
export function useGetSubnetByIdQuery(id: number) {
  return useQuery({
    queryKey: ["subnet", id],
    queryFn: () => getSubnetById(id),
    enabled: Number.isInteger(id),
  });
}

// Create
export function useCreateSubnetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubnet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subnet"] });
    },
  });
}

// Update
export function useUpdateSubnetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Subnet }) => updateSubnet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subnet"] });
    },
  });
}

// Delete
export function useDeleteSubnetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubnet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subnet"] });
    },
  });
}

export function getSubnetbyID(ID: number) {
    const { data: allSubnets, isLoading, isError, isSuccess, error } = useGetSubnetsQuery();

    const data = allSubnets?.filter((subnet: Subnet) => subnet.id === ID);

    return {
      data,
      isLoading,
      isError,
      isSuccess,
      error,
    }
}

