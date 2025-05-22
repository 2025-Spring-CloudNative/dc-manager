import React from 'react';
import styles from './ServiceTable.module.scss';

export default function ServiceHeader() {
  return (
    <div className={styles.headerRow}>
      <div className={styles.tableHeaderText} style={{ width: '135px' }}>Service</div>
      <div className={styles.sepLine}></div>
      <div className={styles.tableHeaderText} style={{ width: '135px' }}>Datacenter</div>
      <div className={styles.sepLine}></div>
      <div className={styles.tableHeaderText} style={{ width: '135px' }}>CIDR</div>
      <div className={styles.sepLine}></div>
      <div className={styles.tableHeaderText} style={{ width: '185px' }}>IP Utilization</div>
    </div>
  );
}