import React, { useState } from 'react';
import styles from './ServiceRackTable.module.scss';
import ServiceRackHeader from './ServiceRackHeader';
import ServiceRackRow from './ServiceRackRow';
import ServiceRackMachineRow from './ServiceRackMachineRow';
import { Fragment } from 'react/jsx-runtime';
import { useGetServicesQuery, useGetServiceByIdQuery, deleteService } from "@/features/service/hooks/useService";
import { useGetDataCentersQuery, useGetDataCenterByIdQuery} from "@/features/dataCenter/hooks/useDataCenter";
import {useGetMachinesQuery} from"@/features/Machine/hooks/useMachine";
import { useGetRackQuery, useGetRackByIdQuery } from "@/features/Racks/hooks/useRack";
import { useGetIPPoolsQuery, useGetIPPoolByIdQuery, useExtendIPPoolMutation, useGetIPPoolUtilizationQuery, getIPPoolUtilization} from "@/features/ipPool/hooks/useIPPool";
import { useGetSubnetsQuery } from "@/features/subnet/hooks/useSubnet";
import { Rack } from "@/features/Racks/types";
import { Service } from "@/features/service/types";
import { IPPool} from "@/features/ipPool/types";
import { DC } from "@/features/dataCenter/types";
import { Subnet } from "@/features/subnet/types";
import { Machine } from "@/features/Machine/types";

interface ServiceRackTableProps {
  selectedServiceRack: Service;
}
// todo: get rack using service id
const initialRack = [
  { id: 1, name: 'Rack A',  utilization: 35 },
  { id: 2, name: 'Rack B', utilization: 45 },
  { id: 3, name: 'Rack C', utilization: 80 },
  { id: 4, name: 'Rack D',  utilization: 100 },
];

const initialMachine= [
  { id: 1, rackId: 1, ip: "192.168.0.1",  dc:"dc a", rack:"rackkk", room: "room a", name: "host A", status: "active", startUnit: 1, unit: 3},
  { id: 1, rackId: 4,  ip: "192.168.0.1", dc:"dc a", rack:"rackkk", room: "room a",  name: "host bbbb", status: "active", startUnit: 5, unit: 2},
];




export default function ServiceRackTable({ selectedServiceRack }: ServiceRackTableProps) {
  const [rack, setRack] = useState(initialRack);
  const [machine, setMachine] = useState(initialMachine);
  const [expandedRackId, setExpandedRackId] = useState<number | null>(null);
  const { data: serviceData, isLoading: isLoadingServices, isError: isErrorServices } = useGetServicesQuery();
  const { data: rackData, isLoading: isLoadingRack, isError: isErrorRack } = useGetRackQuery();
  const { data: machineData, isLoading: isLoadingMachine, isError: isErrorMachine } = useGetMachinesQuery();
  console.log('selectedServiceRack', selectedServiceRack);
  if (isLoadingRack || isLoadingServices || isLoadingMachine ||
    !rackData || !serviceData || !machineData) {
   return <div>Loading...</div>;
 }
  const toggleRack = (id: number) => {
    setExpandedRackId(prev => (prev === id ? null : id));
  };

  const rackInSelectedService = rackData.filter(rack => rack.serviceId === selectedServiceRack.id);
  console.log("machineData", machineData);
  //const racksByService = groupRacksByService(rackData, serviceData);
  console.log("selected_service", rackInSelectedService);

  return (
    <div className={styles.tableContainer}>
      <ServiceRackHeader />
      {rackInSelectedService.map(rack => (
        <Fragment key={rack.id}>
        <ServiceRackRow 
          key={rack.id} rack={rack} 
          onToggle={() => toggleRack(rack.id)} 
          isExpanded={expandedRackId === rack.id}
        />
        {expandedRackId === rack.id && (
          <>
          {
            machineData
              .filter(m => m.rackId === rack.id) 
              .map(machine => (
                <ServiceRackMachineRow
                  key={machine.id}
                  machine={machine}
                />
              ))
          }
        </>
        )}
        </Fragment>
      ))}
      
    </div>
  );
}