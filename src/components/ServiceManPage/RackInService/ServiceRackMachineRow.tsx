import React from 'react';
import styles from './ServiceRackTable.module.scss';

export default function ServiceRackMachineRow({machine}) {
  return (
    <div className={styles.machineRow}>
      <div className={styles.status}>
        <span className={styles.statusText}>{machine.status}</span>
      </div>
      <div className={styles.tableRowText} style={{ width: '135px' }}>{machine.name}</div>
      <div className={styles.sepLine}></div>
      <div className={styles.tableRowText} style={{ width: '135px' }}>{machine.ip}</div>
      <div className={styles.sepLine}></div>
      <div className={styles.tableRowText} style={{ flex: 1 }}>
          {machine.dc} / {machine.room} / {machine.rack} / Unit {machine.startUnit}-{machine.startUnit + machine.unit}
      </div>
      
    </div>
  );
}
