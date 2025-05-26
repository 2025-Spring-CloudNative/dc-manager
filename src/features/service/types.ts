import { DataCenter } from "@/features/dataCenter/types"
export type Service = {
  id?: number;       
  name: string;
  poolId?: number; 
}  

/*
export type DataCenter = {
  name: string;
  location: string;
  subnetId: string;
}*/


export type CreateServiceRequest = {
  service: Service;
  dataCenter: DataCenter;
  cidrFromUser: string;
}

export type TableServiceRow = {
    id: number
    poolId: number
    name: string
    cidr: string
    utilization: number
    datacenter: string
    DC?: DataCenter 
}
