// components/PoolModule.tsx
import React from "react";
import styles from "./poollist.module.scss"; // or your own style file
import Button from "@/components/shared/Button";
import { IpModule } from "@/components/IPmanagement/iplist/iplist";
import { getlocalIPAddressbypoolID} from "@/features/IPAddress/hooks/IPAddress";	
import { useState } from "react";
import { IPAdress } from "@/features/IPAddress/types";

export interface Props {
  id?: number,
  name?: string,
  type?: string,
  cidr?: string,
  created_at?: Date,
  updated_at?: Date,
  // subnet_id?: number,
}

export const PoolModule: React.FC<Props> = ({ id, name, type, cidr, created_at, updated_at }) => {
  const { data: IPaddress } = getlocalIPAddressbypoolID(id) as { data: IPAdress };
  
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleAccordion = (id: number) => {
      setExpandedId(prev => (prev === id ? null : id));
  };

  return (
   <div className={styles.wrapper}>  
          <Button 
              className={styles.icon} 
              // onClick={() => toggleHoneycomb(DC)}
          >
          +
          </Button>
          <div className={styles.frame}>
              <div className={styles.text}>Pool {name?.split("-")[1]}</div>
                  <div className={styles.divider} />
                  <p className={styles.item}>
                  <span className={styles.label}>TYPE:</span>
                  <span className={styles.value}> {type}</span>
                  </p>

                  <div className={styles.divider} />
                  <p className={styles.item}>
                  <span className={styles.label}>CIDR:</span>
                  <span className={styles.value}> {cidr}</span>
                  </p>

                  <div className={styles.divider} />
                  <p className={styles.item}>
                  <span className={styles.label}>uAt:</span>
                  <span className={styles.value}> {updated_at ? updated_at.toLocaleString() : ""}</span>
                  </p>

                  <div className={styles.divider} />
                  <p className={styles.item}>
                  <span className={styles.label}>cAt:</span>
                  <span className={styles.value}>{created_at ? created_at.toLocaleString() : ""}</span>
                  </p>
          </div>
      </div>
  );
};
