import React, { useState } from 'react';
import styles from './ServiceTable.module.scss';
import ServiceHeader from './ServiceHeader';
import ServiceRow from './ServiceRow';

const initialServices = [
  { id: 1, name: 'Web Service', datacenter: 'data_center_A', cidr: '192.168.1.0/24', utilization: 35 },
  { id: 2, name: 'Service B', datacenter: 'DC-B', cidr: '192.168.2.0/24', utilization: 45 },
  { id: 3, name: 'Service C', datacenter: 'DC-B-bb', cidr: '192.168.2.0/24', utilization: 80 },
  { id: 4, name: 'Service D', datacenter: 'DC-ddddd', cidr: '192.168.2.0/24', utilization: 100 },
];

export default function ServiceTable({ onEdit, onViewRack}) {
  const [services, setServices] = useState(initialServices);

  const handleDelete = (id: number) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const ExtendIPPool = (id: number) => {
    // setServices(prev => prev.filter(s => s.id !== id));
    console.log('Extending IP Pool for:', id);
  };

  return (
    <div className={styles.tableContainer}>
      <ServiceHeader />
      {services.map(service => (
        <ServiceRow 
          key={service.id} service={service} 
          onDelete={() => handleDelete(service.id)} 
          onExtendIPPool={() => ExtendIPPool(service.id)} 
          onEdit={onEdit}
          onViewRack={onViewRack}
          
        />
      ))}
    </div>
  );
}