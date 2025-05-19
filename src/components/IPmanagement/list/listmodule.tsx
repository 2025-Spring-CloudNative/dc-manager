import React from 'react';
import styles from './listmodule.module.scss';

interface Props {
    CIDR?: string;
    NETMASK?: string;
    GATEWAY?: string;
    DC?: number;
}

export const ListModule: React.FC<Props> = ({ CIDR, NETMASK, GATEWAY, DC }) => {
    return (
            <div className={styles.frame}>
                <div className={styles.text}>Subnet A</div>
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
                    <span className={styles.value}> {DC}</span>
                    </p>
            </div>
    );
};