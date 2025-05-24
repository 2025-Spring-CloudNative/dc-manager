import React, { useState, useEffect, useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import styles from './ServiceTable.module.scss';
import ServiceHeader from './ServiceHeader';
import ServiceRow from './ServiceRow';
import { useGetServicesQuery, useGetServiceByIdQuery,  useDeleteServiceMutation } from "@/features/service/hooks/useService";
import { useGetDataCentersQuery, useGetDataCenterByIdQuery} from "@/features/dataCenter/hooks/useDataCenter";
import { useGetRackQuery, useGetRackByIdQuery } from "@/features/Racks/hooks/useRack";
import { useGetIPPoolsQuery, useIPPoolsWithUtilizations, useExtendIPPoolMutation, useGetIPPoolUtilizationQuery} from "@/features/ipPool/hooks/useIPPool";
import { useGetSubnetsQuery } from "@/features/subnet/hooks/useSubnet";
import { Rack } from "@/features/Racks/types";
import { Service } from "@/features/service/types";
import { IPPool, IPPoolWithUtilization} from "@/features/ipPool/types";
import { DC } from "@/features/dataCenter/types";
import { Subnet } from "@/features/subnet/types";

/*
const initialServices = [
  { id: 1, name: 'Web Service', datacenter: 'data_center_A', cidr: '192.168.1.0/24', utilization: 35 },
  { id: 2, name: 'Service B', datacenter: 'DC-B', cidr: '192.168.2.0/24', utilization: 45 },
  { id: 3, name: 'Service C', datacenter: 'DC-B-bb', cidr: '192.168.2.0/24', utilization: 80 },
  { id: 4, name: 'Service D', datacenter: 'DC-ddddd', cidr: '192.168.2.0/24', utilization: 100 },
];*/


function generateTableData(
  services: Service[],
  ipPools: IPPoolWithUtilization[],
  subnets: Subnet[],
  dataCenters: DC[]
): Promise<TableServiceRow[]> {
  const tableRows = (
    services.map((service) => {

      //console.log('subnet', subnets)
      //console.log('dataCenters', dataCenters)
      const ipPool = ipPools.find((p) => p.id === service.poolId);
      const subnet = ipPool ? subnets.find((s) => s.id === ipPool.subnetId) : undefined;
      //console.log('subnet!', subnet.id)
      //console.log('ipPool!', ipPool.utilization.utilization)
      const dataCenter = subnet ? dataCenters.find((d) => d.subnetId === subnet.id) : undefined;
      const utilization = ipPool?.utilization?.utilization ?? 0;

      return {
        id: service.id!,
        poolId: service.poolId,
        name: service.name,
        cidr: ipPool?.cidr || "N/A",
        utilization: utilization || 0,
        datacenter: dataCenter?.name || "N/A",
        DC: dataCenter || "N/A",
      };
    })
  );

  return tableRows;
}

/*
function useMultipleIPPoolsUtilization(ipPools: IPPool[]) {
  const queries = useMemo(() => {
    return ipPools.map(pool => ({
      queryKey: ['ip-pool-utilization', pool.id],
      queryFn: () => getIPPoolUtilization(pool.id.toString()),
      enabled: !!pool.id,
    }));
  }, [ipPools]);

  return useQueries({ queries });
}?*/
/*
function groupRacksByService(rackData: Rack[], serviceData: Service[]) {
  const serviceMap: Record<number, Rack[]> = {};
  for (const rack of rackData) {
    const serviceId = rack.serviceId;
    if (!serviceMap[serviceId]) {
      serviceMap[serviceId] = [];
    }
    serviceMap[serviceId].push(rack);
  }
  return serviceMap;
}*/

type TableServiceRow = {
  id: number;
  poolId: number;
  name: string;
  cidr: string;
  utilization: number;
  datacenter: string;
  DC: DC;
};


export default function ServiceTable({ onEdit, onViewRack}) {
  //const [services, setServices] = useState(initialServices);
  ///const [tableData, setTableData] = useState<TableServiceRow[]>([]);
  const { data: serviceData, isLoading: isLoadingServices, isError: isErrorServices } = useGetServicesQuery();
  //const { data: rackData, isLoading: isLoadingRack, isError: isErrorRack } = useGetRackQuery();
  const { data: dcData, isLoading: isLoadingDC, isError: isErrorDC } = useGetDataCentersQuery();
  const { data: ipPoolData, isLoading: isLoadingipPool, isError: isErroripPool } = useIPPoolsWithUtilizations();
  const { data: subnetData, isLoading: isLoadingSubnet, isError: isErrorSubnet } = useGetSubnetsQuery();
  const { mutate: extendIPPool } = useExtendIPPoolMutation();
  const { mutate: deleteService, isLoading: isDeleting } = useDeleteServiceMutation();
  //const { data: pools, isLoading: isLoadingipPoollll, isError: isErroripPoollll } = useIPPoolsWithUtilizations();

   

  //console.log("ipPoolData", ipPoolData);

  if ( isLoadingServices || isLoadingDC || isLoadingipPool || isLoadingSubnet ||

     !serviceData || !dcData || !ipPoolData || !subnetData ) {
    return <div>Loading...</div>;
  }

  //console.log("pools", pools);
  console.log("ipPoolData", ipPoolData);

  //const utilizationQueries = useMultipleIPPoolsUtilization(ipPoolData);

  //console.log('servicedata:', serviceData);
  //console.log('Rackdata:', rackData);
  //console.log('subnetData:', subnetData);

  //const racksByService = groupRacksByService(rackData, serviceData);
  //console.log("racksByService", racksByService);

  //console.log("ipPoolData", ipPoolData);
  //const services = generateTableData(serviceData, ipPoolData, subnetData, dcData);
  const services = useMemo(() => {
    if (!serviceData || !ipPoolData || !subnetData || !dcData) return [];
    return generateTableData(serviceData, ipPoolData, subnetData, dcData);
  }, [serviceData, ipPoolData, subnetData, dcData]);
  
  const handleDelete = (id: number) => {
    //setServices(prev => prev.filter(s => s.id !== id));
    if (window.confirm("確定要刪除這個服務？")) {
      deleteService(id);
    }
  };

  const ExtendIPPool = (service: Service) => {
    // setServices(prev => prev.filter(s => s.id !== id));
    console.log('Extending IP Pool for:', service);
    extendIPPool({ id: service.poolId, cidr: service.cidr });
  };

  return (
    <div className={styles.tableContainer}>
      <ServiceHeader />
      {services.map(service => (
        <ServiceRow 
          key={service.id} service={service} 
          onDelete={() => handleDelete(service.id)} 
          onExtendIPPool={() => ExtendIPPool(service)} 
          onEdit={onEdit}
          onViewRack={onViewRack}
          
        />
      ))}
    </div>
  );
}