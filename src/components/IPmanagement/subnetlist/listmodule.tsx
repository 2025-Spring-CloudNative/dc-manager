import React from 'react';
import styles from './listmodule.module.scss';
import Button from "@/components/shared/Button";
import { useState } from 'react';
import { PoolModule } from "@/components/IPmanagement/poollist/poollist";
import { IP } from "@/features/IPPool/types";
import { getlocalIPPoolbysubnetId, useGetIPPoolbysubnetIdQuery } from "@/features/IPPool/hooks/IPPool";

interface Props {
    CIDR?: string;
    NETMASK?: string;
    GATEWAY?: string;
    DC?: number;
    // isExpanded: boolean;
    // onToggle: (id: number) => void;
}

export const ListModule: React.FC<Props> = ({ CIDR, NETMASK, GATEWAY, DC}) => {

    const { data: allIPs } = useGetIPPoolbysubnetIdQuery(DC!) as { data: IP };

    const [expandedId, setExpandedId] = useState<number | null>(null);

    const toggleAccordion = (id: number) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    return (
            
        <div className={styles.listBlock} >
            <div className={styles.wrapper}>
                <Button
                className={styles.icon}
                onClick={() => toggleAccordion(DC!)}
                >
                {expandedId ? "-" : "+"}
                </Button>

                <div className={styles.frame}>
                    <div className={styles.text}>Subnet {DC}</div>
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
                        <span className={styles.value}>{DC}</span>
                    </p>
                </div>
            </div>

            {expandedId && allIPs && Array.isArray(allIPs) && allIPs.map((ip: IP) => (
                <div key={'pool' + ip.id} className={styles.honeycombWrapper} >
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
    );
};