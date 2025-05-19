import React from "react";
import styles from "./subnet.module.scss";
import { ListModule } from "../list";
import { useGetSubnetsQuery } from "@/features/subnet/hooks/useSubnet";
import { Subnet } from "@/features/subnet/types";

interface Props {
  className?: string;
}

export const SubnetModule: React.FC<Props> = ({ className }) => {
  const { data: subnets, isLoading, isError, error } = useGetSubnetsQuery();

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {(error as Error).message}</p>}
      {subnets && subnets.length === 0 && <p>No subnets available</p>}
      <div className={`${styles.component} ${className || ""}`}>
        {subnets &&
            subnets.map((subnet: Subnet, index: number) => (
            <div key={index}>
                <ListModule
                    CIDR={subnet.cidr}
                    NETMASK={subnet.netmask}
                    GATEWAY={subnet.gateway}
                    DC={subnet.id}
                />
            </div>
            ))}
        </div>
      <div className={styles.icon} />
    </div>
    
  );
};
