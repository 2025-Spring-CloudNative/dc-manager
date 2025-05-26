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
      <div className={`${styles.squareBox} ${
                            rackUtilization?.utilization === 0.1
                                ? styles.red
                                : rackUtilization?.utilization > 0.1
                                ? styles.yellow
                                : styles.green
                        }`}></div>
      <div className={styles.tableRowText} style={{ width: '135px' }}>{rack.name}</div>
      <div className={styles.sepLine}></div>
      <div className={styles.utilBar}>
        <div style={{ width: `${(rackUtilization.utilization) * 150}px` }} 
        className={`${styles.utilFill} ${rackUtilization.utilization >= 0.8 ? styles.utilHigh : ''}`} />
        <span>{(rackUtilization.utilization * 100).toFixed(2)}%</span>
      </div>
    </div>
  );
}
