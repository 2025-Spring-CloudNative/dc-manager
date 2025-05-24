import React from 'react';
import styles from './ServiceRackTable.module.scss';

export default function ServiceRackRow({rack, onToggle, isExpanded, rackUtilization}) {

  console.log("Rack Utilizations:", rackUtilization.utilization);
  return (
    <div className={styles.row}>
      <button
        className={`${styles.showBtn} ${isExpanded ? styles.minusIcon : styles.plusIcon}`}
        onClick={onToggle}
      />
      <div className={styles.tableRowText} style={{ width: '135px' }}>{rack.name}</div>
      <div className={styles.sepLine}></div>
      <div className={styles.utilBar}>
        <div style={{ width: `${(rackUtilization.utilization) * 150}px` }} 
        className={`${styles.utilFill} ${rackUtilization.utilization >= 0.8 ? styles.utilHigh : ''}`} />
        <span>{rackUtilization.utilization}%</span>
      </div>
    </div>
  );
}
