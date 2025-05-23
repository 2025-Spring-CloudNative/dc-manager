import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {axios, AxiosInstance} from "axios";
import {
  getIPPool,
  getIPPoolById,
  createIPPool,
  updateIPPool,
  deleteIPPool,
  extendIPPool,
  getIPPoolUtilization
} from "../apis/ipPoolApi";
import { IPPool } from "../types"
import { useMemo } from "react";

// Get all
export function useGetIPPoolsQuery() {
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["ip-pool"],
    queryFn: getIPPool,
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
export function useGetIPPoolByIdQuery(id: string) {
  return useQuery({
    queryKey: ["ip-pool", id],
    queryFn: () => getIPPoolById(id),
    enabled: !!id,
  });
}

// Create
export function useCreateIPPoolMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPPool) => createIPPool(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ip-pool"] });
    },
  });
}

// Update
export function useUpdateIPPoolMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IPPool) => updateIPPool( data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ip-pool"] });
    },
  });
}

// Delete
export function useDeleteIPPoolMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteIPPool(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ip-pool"] });
    },
  });
}

/*
export function useGetIPPoolUtilizationQuery(id: string) {
  return useQuery({
    queryKey: ["ip-pool", id],
    queryFn: () => getIPPoolUtilization(id),
    enabled: !!id,
  });
}*/

export async function getIPPoolUtilization(id: string) {
  const response = await axiosInstance.get(`/util/${id}`);
  return response.data;
}

export function useExtendIPPoolMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => extendIPPool(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ip-pool"] });
    },
  });
}


