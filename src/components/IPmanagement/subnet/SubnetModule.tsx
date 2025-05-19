import React from "react";
import styles from "./subnet.module.scss";
import { ListModule } from "../subnetlist";
import { useGetSubnetsQuery } from "@/features/subnet/hooks/useSubnet";
import { Subnet } from "@/features/subnet/types";
import Button from "@/components/shared/Button";

interface Props {
  className?: string;
}

export const SubnetModule: React.FC<Props> = ({ className }) => {
  const { data: subnets, isLoading, isError, error } = useGetSubnetsQuery();
  
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {(error as Error).message}</p>}
      {/* {subnets && subnets.length === 0 && <p>No subnets available</p>} */}
      
        {subnets &&
            subnets.map((subnet: Subnet, index: number) => (
              
              <div className={`${styles.component} ${className || ""}`}>
                <div key={index}>
                  <div>
                    <ListModule
                        CIDR={subnet.cidr}
                        NETMASK={subnet.netmask}
                        GATEWAY={subnet.gateway}
                        DC={subnet.id}
                    />
                  </div>
                  <div style={{ marginBottom: "10px" }} />
                </div>
              </div>    
            ))}
      
      
    </div>
    
  );
};
