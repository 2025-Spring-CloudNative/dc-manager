export type IPPool = {
  id?: number;       
  name: string;
  type: string;
  cidr: string;
  subnetId: number;
}  

export type IPPoolWithUtilization = IPPool & {
  utilization?: number;
};

