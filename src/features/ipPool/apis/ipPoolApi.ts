import { IPPool } from "@/features/ipPool/types"
import api from "@/lib/axios"
//  GET all IPS
export async function getIPPools(): Promise<IPPool[]> {
    try {
        const response = await api.get("/ip-pool")
        return response.data
    } catch (error) {
        console.error("Error fetching IP data:", error)
        throw error
    }
}

export async function getIPPoolbysubnetId(subnetId: number) {
    try {
        const response = await api.get(`ip-pool/?subnetId=${subnetId}`)
        return response.data
    } catch (error) {
        console.error("Error fetching IP data:", error)
        throw error
    }
}


// add 
export async function getIPPool() {
  try {
    const response = await api.get("/ip-pool");
    return response.data;
  } catch (error) {
    console.error("Error fetching ip pool data:", error);
    throw error;
  }
}

export async function getIPPoolById(id: number) {
  try {
    const response = await api.get(`/ip-pool/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ip pool by ID:", error);
    throw error;
  }
}

export async function createIPPool(data: IPPool): Promise<IPPool> {
  try {
    const response = await api.post("/ip-pool", data);
    return response.data;
  } catch (error) {
    console.error("Error creating ip pool:", error);
    throw error;
  }
}



export async function updateIPPool(id: number, data: IPPool): Promise<IPPool>  {
  try {
    const response = await api.patch(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating ip pool:", error);
    throw error;
  }
}

export async function deleteIPPool(id: number): Promise<void>   {
  try {
    const response = await api.delete(`/ip-pool/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting ip pool:", error);
    throw error;
  }
}

export async function getIPPoolUtilization(id: number) {
  try {
    const response = await api.get(`ip-pool/util/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ip pool utilization by ID:", error);
    throw error;
  }
}



/*
export async function extendIPPool(id: number, cidr: string) {

  try {
    const response = await apiInstance.patch(`/extend/${id}`, cidr)
    
    return response.data;
  } catch (error) {
    console.error("Error extending ip pool by ID:", error);
    throw error;
  }
}
*/

type ExtendIPPoolVariables = {
  id: number
  cidr: string
}

export async function extendIPPool({
  id,
  cidr,
}: ExtendIPPoolVariables) {
  try {
    const response = await api.patch(`/ip-pool/extend/${id}`, {cidr})
    return response.data
  } catch (error) {
    console.error("Error extending ip pool by ID:", error)
    throw error
  }
}
