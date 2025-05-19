// components/PoolModule.tsx
import React from "react";
import styles from "./poollist.module.scss"; // or your own style file

export interface Props {
  CIDR?: string;
  NETMASK?: string;
  GATEWAY?: string;
  DC?: number;
}

export const PoolModule: React.FC<Props> = ({ CIDR, NETMASK, GATEWAY, DC }) => {
  return (
    <div className={styles.poolcantainer}>
      <p><strong>蜂巢 Pool View</strong></p>
      <p><span className={styles.label}>CIDR:</span> {CIDR}</p>
      <p><span className={styles.label}>NETMASK:</span> {NETMASK}</p>
      <p><span className={styles.label}>GATEWAY:</span> {GATEWAY}</p>
      <p><span className={styles.label}>DC:</span> {DC}</p>
    </div>
  );
};
