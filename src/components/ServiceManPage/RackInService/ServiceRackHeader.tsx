
import styles from './ServiceRackTable.module.scss';

export default function ServiceRackHeader() {
  return (
    <div className={styles.headerRow}>
      <div className={styles.tableHeaderText} style={{ width: '202px' }}> Rack</div>
      <div className={styles.sepLine}></div>
      <div className={styles.tableHeaderText} style={{ width: '170px' }}>Rack Utilization</div>
      </div>
  );
}