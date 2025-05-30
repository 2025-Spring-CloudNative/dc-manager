import React from "react"
import styles from "./listmodule.module.scss"
import Button from "@/components/shared/Button"
import { useState } from "react"
import { PoolModule } from "@/components/IPmanagement/poollist/poollist"
import { IPPool /* IPPoolWithUtilization */ } from "@/features/ipPool/types"
import { SubnetWithUtilization } from "@/features/subnet/types"
import { DataCenter } from "@features/dataCenter/types"
import {useGetIPPoolsBySubnetIdQuery} from "@/features/ipPool/hooks/useIPPool"
import { useGetDataCenterBySubnetIDQuery } from "@/features/dataCenter/hooks/useDataCenter"
import { useGetSubnetUtilizationQuery } from "@/features/subnet/hooks/useSubnet"
interface Props {
    CIDR?: string
    NETMASK?: string
    GATEWAY?: string
    id?: number
    // isExpanded: boolean;
    // onToggle: (id: number) => void;
}

export const ListModule: React.FC<Props> = ({ CIDR, NETMASK, GATEWAY, id }) => {
    const { data: allIPs } = useGetIPPoolsBySubnetIdQuery(id!) as {
        data: IPPool
    }
    console.log("All IPs Data:", allIPs)
    const { data: dcArr } = useGetDataCenterBySubnetIDQuery(id!) as {
        data: DataCenter[]
    }
    const dc = Array.isArray(dcArr) && dcArr.length > 0 ? dcArr[0] : null
    const { data: subnet } = useGetSubnetUtilizationQuery(id!) as {
        data: SubnetWithUtilization
    }
    if (subnet?.utilization !== undefined) {
    console.log("Subnet Utilization Data:", subnet.utilization)
}

    const [expandedId, setExpandedId] = useState<number | null>(null)

    const toggleAccordion = (id: number) => {
        setExpandedId((prev) => (prev === id ? null : id))
    }

    return (
        <div className={styles.listBlock}>
            <div className={styles.wrapper}>
                <Button
                    className={styles.icon}
                    onClick={() => toggleAccordion(id!)}
                >
                    {expandedId ? "-" : "+"}
                </Button>

                <div className={styles.frame}>
                    <div
                        className={`${styles.squareBox} ${
                            subnet?.utilization === 1
                                ? styles.red
                                : subnet?.utilization >= 0.8
                                ? styles.yellow
                                : styles.green
                        }`}
                    ></div>
                    {/* <div className={`${styles.squareBox} ${styles.yellow}`}></div> */}
                    <div className={styles.text}>Subnet {id}</div>
                    <div className={styles.divider} />
                    <p className={styles.item}>
                        <span className={styles.label}>CIDR:</span>
                        <span className={styles.value}> {CIDR}</span>
                    </p>
                    <div className={styles.divider} />
                    <p className={styles.item}>
                        <span className={styles.label}>NETMASK:</span>
                        <span className={styles.value}> {NETMASK}</span>
                    </p>
                    <div className={styles.divider} />
                    <p className={styles.item}>
                        <span className={styles.label}>GATEWAY:</span>
                        <span className={styles.value}> {GATEWAY}</span>
                    </p>
                    <div className={styles.divider} />
                    <p className={styles.item}>
                        <span className={styles.label}>DC:</span>
                        <span className={styles.value}>
                            {dc ? dc.id : "Null"}
                        </span>
                    </p>
                    <div className={styles.utilBar}>
                        {subnet?.utilization !== undefined && (
                            <>
                                <div
                                    style={{
                                        width: `${subnet.utilization * 150}px`,
                                    }}
                                    className={`${styles.utilFill} ${
                                        subnet.utilization >= 0.8
                                            ? styles.utilHigh
                                            : ""
                                    }`}
                                />
                                <span>{subnet.utilization}%</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {expandedId &&
                allIPs &&
                Array.isArray(allIPs) &&
                allIPs.map((ip: IPPool) => (
                    <div
                        key={"pool" + ip.id}
                        className={styles.honeycombWrapper}
                    >
                        <PoolModule
                            id={ip.id}
                            name={ip.name}
                            type={ip.type}
                            cidr={ip.cidr}
                            created_at={ip.createdAt}
                            updated_at={ip.updatedAt}
                        />
                    </div>
                ))}
        </div>
    )
}
