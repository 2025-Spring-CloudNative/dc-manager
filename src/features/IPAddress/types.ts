export type IPAdress = 
{
  id?: number,
  machineId: number,
  poolId: number,
  address: string,
  status: string,
  createdAt: Date,
  updatedAt: Date,
  allocatedAt: Date,
  releasedAt: number,
}