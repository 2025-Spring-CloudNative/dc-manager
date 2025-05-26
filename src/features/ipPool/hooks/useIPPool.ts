import { useQuery, useMutation, useQueryClient , useQueries } from "@tanstack/react-query";
import {
  getIPPool,
  getIPPoolById,
  getIPPoolbysubnetId,
  createIPPool,
  updateIPPool,
  deleteIPPool,
  extendIPPool,
  getIPPoolUtilization
} from "../apis/ipPoolApi";
import { IPPool } from "../types"

// Get all
export function useGetIPPoolsQuery() {
  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: ["ip-pool"],
    queryFn: getIPPool,
  });

  return {
    data,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
  };
}

// Get by ID
export function useGetIPPoolByIdQuery(id: number) {
  return useQuery({
    queryKey: ["ip-pool", id],
    queryFn: () => getIPPoolById(id),
    enabled: !!id,
  });
}

// Get by subnet ID
export function useGetIPPoolsBySubnetIdQuery(subnetId: number) {
  return useQuery({
    queryKey: ["ip-pool", "subnet", subnetId],
    queryFn: () => getIPPoolbysubnetId(subnetId),
    enabled: !!subnetId,
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
    mutationFn: (id: number) => deleteIPPool(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ip-pool"] });
    },
  });
}


export function useGetIPPoolUtilizationQuery(id: number) {
  return useQuery({
    queryKey: ["ip-pool", id],
    queryFn: () => getIPPoolUtilization(id),
    enabled: !!id,
  });
}

/*
export async function getIPPoolUtilization(id: string) {
  const response = await axiosInstance.get(`/util/${id}`);
  return response.data;
}*/


/*
export function useExtendIPPoolMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, cidr }: { id: string; cidr: string }) => extendIPPool(id, cidr),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ip-pool"] });
    },
  });
}*/

export const useExtendIPPoolMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
      mutationFn: extendIPPool,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["ip-pool"] }) // refresh session data
      },
  })
}


export function useIPPoolsWithUtilizations() {
  const {
    data: allIPPools,
    isLoading: poolsLoading,
    isError: poolsError,
    refetch: refetchPools,
  } = useGetIPPoolsQuery();

  const utilizationQueries = useQueries({
    queries:
      (allIPPools ?? []).map((pool) => ({
        queryKey: ["ip-pool", pool.id],
        queryFn: () => getIPPoolUtilization(pool.id),
        enabled: !!pool.id,
      })) ?? [],
  });

  const poolsWithUtilization = allIPPools?.map((pool, index) => ({
    ...pool,
    utilization: utilizationQueries[index]?.data,
    isLoading: utilizationQueries[index]?.isLoading,
    isError: utilizationQueries[index]?.isError,
  }));

  const isUtilLoading = utilizationQueries.some((q) => q.isLoading);
  const isUtilError = utilizationQueries.some((q) => q.isError);

  // 收集所有 utilization queries 的 refetch
  const refetchUtilizations = () => {
    return Promise.all(utilizationQueries.map(q => q.refetch()));
  };

  // 這裡回傳一個 function 可用來 refresh 整體資料
  const refetchAll = async () => {
    await refetchPools();
    await refetchUtilizations();
  };

  return {
    data: poolsWithUtilization,
    isLoading: poolsLoading || isUtilLoading,
    isError: poolsError || isUtilError,
    refetch: refetchAll,
  };
}