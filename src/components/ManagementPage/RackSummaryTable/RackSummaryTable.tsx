import  Button  from "@/components/shared/Button";
import  Card  from "@/components/ManagementPage/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/Table";

import styles from "./RackSummaryTable.module.scss";

export const RackSummaryTable = (): JSX.Element => {
  const dataCenters = [
    {
      name: "DC - A",
      rackCount: 3,
      unitCount: 9,
      hosts: ["Host 1", "Host 2", "Host 3"],
      favorites: ["常用-左", "常用-右"],
    },
    {
      name: "DC - A",
      rackCount: 3,
      unitCount: 9,
      hosts: ["Host 1", "Host 2", "Host 3"],
      favorites: ["常用-左", "常用-右"],
    },
    {
      name: "DC - A",
      rackCount: 3,
      unitCount: 9,
      hosts: ["Host 1", "Host 2", "Host 3"],
      favorites: ["常用-左", "常用-右"],
    },
    {
      name: "DC - A",
      rackCount: 3,
      unitCount: 9,
      hosts: ["Host 1", "Host 2", "Host 3"],
      favorites: ["常用-左", "常用-右"],
    },
  ];

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
            {dataCenters.map((dc, index) => (
              <TableRow key={index}>
                <TableCell>{dc.name}</TableCell>
                <TableCell>{dc.rackCount}</TableCell>
                <TableCell>{dc.unitCount}</TableCell>
                <TableCell>
                <div className={styles.ButtonGroup}>
                    {dc.hosts.map((host, hostIndex) => (
                      <Button
                        key={hostIndex}
                        className={styles.infoButton}
                      >
                        {host}
                      </Button>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={styles.favoriteGroup}>
                    {dc.favorites.map((favorite, favIndex) => (
                      <Button
                        key={favIndex}
                        className={`${styles.infoButton} ${styles.favoriteButton}`}
                      >
                        {favorite}
                      </Button>
                    ))}
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