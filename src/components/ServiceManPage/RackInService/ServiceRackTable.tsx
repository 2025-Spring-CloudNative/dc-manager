import React, { useState } from 'react';
import styles from './ServiceRackTable.module.scss';
import ServiceRackHeader from './ServiceRackHeader';
import ServiceRackRow from './ServiceRackRow';
import ServiceRackMachineRow from './ServiceRackMachineRow';
import { Fragment } from 'react/jsx-runtime';
import { useGetServicesQuery } from "@/features/service/hooks/useService";
import {useGetMachinesQuery} from"@/features/Machine/hooks/useMachine";
import { useGetRackQuery} from "@/features/Racks/hooks/useRack";
import { Service } from "@/features/service/types";

interface ServiceRackTableProps {
  selectedServiceRack: Service;
}
// todo: get rack using service id
/*
const initialRack = [
  { id: 1, name: 'Rack A',  utilization: 35 },
  { id: 2, name: 'Rack B', utilization: 45 },
  { id: 3, name: 'Rack C', utilization: 80 },
  { id: 4, name: 'Rack D',  utilization: 100 },
];

const initialMachine= [
  { id: 1, rackId: 1, ip: "192.168.0.1",  dc:"dc a", rack:"rackkk", room: "room a", name: "host A", status: "active", startUnit: 1, unit: 3},
  { id: 1, rackId: 4,  ip: "192.168.0.1", dc:"dc a", rack:"rackkk", room: "room a",  name: "host bbbb", status: "active", startUnit: 5, unit: 2},
];*/




export default function ServiceRackTable({ selectedServiceRack }: ServiceRackTableProps) {
  //const [rack, setRack] = useState(initialRack);
  //const [machine, setMachine] = useState(initialMachine);
  const [expandedRackId, setExpandedRackId] = useState<number | null>(null);
  const { data: serviceData, isLoading: isLoadingServices} = useGetServicesQuery();
  const { data: rackData, isLoading: isLoadingRack} = useGetRackQuery();
  const { data: machineData, isLoading: isLoadingMachine, } = useGetMachinesQuery();
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

  const rackUtilizations = rackInSelectedService.map(rack => {
    const machinesInRack = machineData.filter(machine => machine.rackId === rack.id);
    const usedUnits = machinesInRack.reduce((total, machine) => total + machine.unit, 0);

    const utilization = rack.height > 0 ? usedUnits / rack.height : 0;
    return {
      rackId: rack.id,
      usedUnits,
      totalUnits: rack.height,
      utilization,
    };
  });

  
  console.log("Rack Utilizations:", rackUtilizations);

  return (
    <div className={styles.tableContainer}>
      <ServiceRackHeader />
      {rackInSelectedService.map(rack => {
        const rackUtil = rackUtilizations.find(util => util.rackId === rack.id);
        console.log("rackUtil", rackUtil);
        return (
          <Fragment key={rack.id}>
            <ServiceRackRow 
              rack={rack} 
              onToggle={() => toggleRack(rack.id!)} 
              isExpanded={expandedRackId === rack.id}
              rackUtilization={rackUtil}
            />
            {expandedRackId === rack.id && (
              <>
                {machineData
                  .filter(m => m.rackId === rack.id) 
                  .map(machine => (
                    <ServiceRackMachineRow
                      key={machine.id}
                      machine={machine}
                      rack={rack}
                    />
                  ))}
              </>
            )}
          </Fragment>
        );
      })}
    </div>
  )
}