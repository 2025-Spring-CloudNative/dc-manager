export type IPPool = 
{
  id: number,
  name: string,
  type: string,
  cidr: string,
  createdAt: Date,
  updatedAt: Date,
  subnetId: number,
}

export type IPPoolWithUtilization = IPPool & {
  utilization: number;
};