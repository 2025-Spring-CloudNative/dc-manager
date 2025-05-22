import React from 'react';
import styles from './ServiceTable.module.scss';

export default function ServiceRow({ service, onDelete, onEdit, onViewRack, onExtendIPPool }) {
  return (
    <div className={styles.row}>
      <div className={styles.tableRowText} style={{ width: '135px' }}>{service.name}</div>
      <div className={styles.sepLine}></div>
      <div className={styles.tableRowText} style={{ width: '135px' }}>{service.datacenter}</div>
      <div className={styles.sepLine}></div>
      <div className={styles.tableRowText} style={{ width: '135px' }}>{service.cidr}</div>
      <div className={styles.sepLine}></div>
      <div className={styles.utilBar}>
        <div style={{ width: `${(service.utilization / 100) * 150}px` }} 
        className={`${styles.utilFill} ${service.utilization >= 80 ? styles.utilHigh : ''}`} />
        <span>{service.utilization}%</span>
      </div>
      <button onClick={onExtendIPPool} className={styles.extendIPPool}>[+] IP Pool</button>
      <button onClick={() => onViewRack(service)} className={styles.viewRackBtn}>查看Rack</button>
      <button onClick={onEdit} className={styles.editBtn}>編輯</button>
      <button onClick={onDelete} className={styles.deleteBtn}>刪除</button>
    </div>
  );
}
