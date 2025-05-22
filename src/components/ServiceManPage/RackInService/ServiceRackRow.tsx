import React from 'react';
import styles from './ServiceRackTable.module.scss';

export default function ServiceRackRow({rack, onToggle, isExpanded}) {
  return (
    <div className={styles.row}>
      <button
        className={`${styles.showBtn} ${isExpanded ? styles.minusIcon : styles.plusIcon}`}
        onClick={onToggle}
      />
      <div className={styles.tableRowText} style={{ width: '135px' }}>{rack.name}</div>
      <div className={styles.sepLine}></div>
      <div className={styles.utilBar}>
        <div style={{ width: `${(rack.utilization / 100) * 150}px` }} 
        className={`${styles.utilFill} ${rack.utilization >= 80 ? styles.utilHigh : ''}`} />
        <span>{rack.utilization}%</span>
      </div>
    </div>
  );
}
