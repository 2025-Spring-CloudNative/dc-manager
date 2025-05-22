import React from "react";
import styles from "./subnet.module.scss";
import { ListModule } from "../subnetlist";
import { useGetSubnetsQuery } from "@/features/subnet/hooks/useSubnet";
import { Subnet } from "@/features/subnet/types";


interface Props {
  className?: string;
}

export const SubnetModule: React.FC<Props> = ({ className }) => {
  const { data: subnets, isLoading, isError, error } = useGetSubnetsQuery();
  
  return (
    <div className={styles.scrollContainer} key={'subnet'}>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {(error as Error).message}</p>}      
      {subnets &&
        subnets.map((subnet: Subnet, index: number) => (
          <div className={`${styles.component} ${className || ""}`} key={'subnet' + index}>
            <div key={index}>
              <div>
                  <ListModule
                      CIDR={subnet.cidr}
                      NETMASK={subnet.netmask}
                      GATEWAY={subnet.gateway}
                      id={subnet.id}
                  />
                </div>
                <div style={{ marginBottom: "10px" }} />
              </div>
            </div>    
          ))}
      
      
    </div>
    
  );
};
