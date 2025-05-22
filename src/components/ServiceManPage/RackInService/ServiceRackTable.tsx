import React, { useState } from 'react';
import styles from './ServiceRackTable.module.scss';
import ServiceRackHeader from './ServiceRackHeader';
import ServiceRackRow from './ServiceRackRow';
import ServiceRackMachineRow from './ServiceRackMachineRow';
import { Fragment } from 'react/jsx-runtime';


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




export default function ServiceRackTable() {
  const [rack, setRack] = useState(initialRack);
  const [machine, setMachine] = useState(initialMachine);
  const [expandedRackId, setExpandedRackId] = useState<number | null>(null);

  const toggleRack = (id: number) => {
    setExpandedRackId(prev => (prev === id ? null : id));
  };

  const handleDelete = (id: number) => {
    setRack(prev => prev.filter(s => s.id !== id));
  };

  const ExtendIPPool = (id: number) => {
    // setServices(prev => prev.filter(s => s.id !== id));
    console.log('Extending IP Pool for:', id);
  };

  return (
    <div className={styles.tableContainer}>
      <ServiceRackHeader />
      {rack.map(rack => (
        <Fragment key={rack.id}>
        <ServiceRackRow 
          key={rack.id} rack={rack} 
          onToggle={() => toggleRack(rack.id)} 
          isExpanded={expandedRackId === rack.id}
        />
        {expandedRackId === rack.id && (
          <>
          {
            machine
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