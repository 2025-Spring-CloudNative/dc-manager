// components/PoolModule.tsx
import React from "react";
import styles from "./iplist.module.scss"; // or your own style file
import Button from "@/components/shared/Button";

export interface Props {
  id?: number,
  machineId: number,
  // poolId: number,
  address: string,
  status: string,
  createdAt: Date,
  updatedAt: Date,
  allocatedAt: Date,
  releasedAt: number,
}

export const IpModule: React.FC<Props> = ({ id, machineId, address, status, createdAt, updatedAt, allocatedAt, releasedAt }) => {

  return (
   <div className={styles.wrapper}>  
          <Button 
              className={styles.icon} 
              // onClick={() => toggleHoneycomb(DC)}
          >
          +
          </Button>
          <div className={styles.frame}>
            {/* <div className={styles.text}>IP {id}</div> */}
            <div className={styles.machineInfo}>
              <div className={styles.address}>{address}</div>
              <div className={styles.machineId}>machine-{machineId}</div>
            </div>
            <div className={styles.divider} />
            <p className={styles.item}>
            <span className={styles.label}>STATUS:</span>
            <span className={styles.value}> {status}</span>
            </p>

            <div className={styles.divider} />
            <p className={styles.item}>
            <span className={styles.label}>uAt:</span>
            <span className={styles.value}> {updatedAt ? updatedAt.toLocaleString().split("T")[0] : ""}</span>
            </p>

            <div className={styles.divider} />
            <p className={styles.item}>
            <span className={styles.label}>cAt:</span>
            <span className={styles.value}> {createdAt ? createdAt.toLocaleString().split("T")[0] : ""}</span>
            </p>

            <div className={styles.divider} />
            <p className={styles.item}>
            <span className={styles.label}>aAt:</span>
            <span className={styles.value}>{allocatedAt ? allocatedAt.toLocaleString().split("T")[0] : ""}</span>
            </p>

            <div className={styles.divider} />
            <p className={styles.item}>
            <span className={styles.label}>rAt:</span>
            <span className={styles.value}>{releasedAt ? releasedAt.toLocaleString().split("T")[0] : ""}</span>
            </p>
          </div>
      </div>
  );
};
