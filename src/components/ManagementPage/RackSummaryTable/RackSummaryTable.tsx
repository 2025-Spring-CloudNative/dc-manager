// RackSummaryTable.tsx

import Button from "@/components/shared/Button";
import Card from "@/components/ManagementPage/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/Table";

import styles from "./RackSummaryTable.module.scss";
import { DataCenters, DataCenter } from "@/components/data/rackData";

interface RackSummaryTableProps {
  onAddToLeft: (dataCenter: DataCenter) => void;
  onAddToRight: (dataCenter: DataCenter) => void;
}

const RackSummaryTable: React.FC<RackSummaryTableProps> = ({ onAddToLeft, onAddToRight }) => {
  return (
    <Card className={styles.dataCenterCard}>
      <div className={styles.tableWrapper}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>機櫃名稱</TableHead>
              <TableHead>Rack 數量</TableHead>
              <TableHead>Unit 數量</TableHead>
              <TableHead>現有機器</TableHead>
              <TableHead>加到常用</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DataCenters.map((dc: DataCenter, index: number) => (
              <TableRow key={index}>
                <TableCell>{dc.id}</TableCell>
                <TableCell>{dc.rackCount}</TableCell>
                <TableCell>{dc.unitCount}</TableCell>
                <TableCell>
                  <div className={styles.ButtonGroup}>
                    {dc.hosts.map((host, hostIndex) => (
                      <Button key={hostIndex} className={styles.infoButton}>
                        {host}
                      </Button>
                    ))}
                    {dc.hosts.length > 5 && (
                      <Button className={styles.infoButton}>...</Button>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={styles.favoriteGroup}>
                    <Button
                      className={`${styles.infoButton} ${styles.favoriteButton}`}
                      onClick={() => onAddToLeft(dc)}
                    >
                      加到left
                    </Button>
                    <Button
                      className={`${styles.infoButton} ${styles.favoriteButton}`}
                      onClick={() => onAddToRight(dc)}
                    >
                      加到right
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default RackSummaryTable;