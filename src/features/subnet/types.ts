export type Subnet = 
{
  id?: number;
  cidr: string,
  netmask: string,
  gateway: string
}

export type SubnetWithUtilization = Subnet & {
  utilization?: number;
};