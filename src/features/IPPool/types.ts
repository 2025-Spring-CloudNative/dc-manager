export type IPPool = 
{
  id: number,
  name: string,
  type: string,
  cidr: string,
  createdAt: Date,
  updatedAt: Date,
  subnet_id: number,
}

export type IPPoolWithUtilization = IPPool & {
  utilization?: number;
};