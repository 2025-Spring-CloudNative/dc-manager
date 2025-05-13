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
  return useQuery({
    queryKey: ["subnet"],
    queryFn: getSubnets,
  });
}

// Single
export function useGetSubnetByIdQuery(id: string) {
  return useQuery({
    queryKey: ["subnet", id],
    queryFn: () => getSubnetById(id),
    enabled: !!id,
  });
}

// Create
export function useCreateSubnetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubnet,
    onSuccess: () => {
      queryClient.invalidateQueries(["subnet"]);
    },
  });
}

// Update
export function useUpdateSubnetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Subnet }) => updateSubnet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["subnet"]);
    },
  });
}

// Delete
export function useDeleteSubnetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubnet,
    onSuccess: () => {
      queryClient.invalidateQueries(["subnet"]);
    },
  });
}
