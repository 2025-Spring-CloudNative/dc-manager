import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMachines, getMachineById, createMachine, updateMachine, deleteMachine } from "../apis/MachineApi";
import { Machine } from "../types";

export function useGetMachinesQuery() {
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["machines"],
    queryFn: getMachines,
  });

  return {
    data,
    isLoading,
    isError,
    isSuccess,
    error,
  };
}
export function useGetMachineByIdQuery(id: number) {
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["machines", id],
    queryFn: () => getMachineById(id),
  });

  return {
    data,
    isLoading,
    isError,
    isSuccess,
    error,
  };
}
// Create
export function useCreateMachineMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Machine) => createMachine(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
    },
  });
}
// Update 
export function useUpdateMachineMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Machine }) => updateMachine(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
    },
  });
}
// Delete
export function useDeleteMachineMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteMachine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
    },
  });
} 