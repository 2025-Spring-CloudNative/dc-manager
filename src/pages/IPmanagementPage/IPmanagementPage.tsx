import { useState } from "react"
import { Link } from "react-router-dom"
import styles from "./IPmanagementPage.module.scss"

import { SubnetModule } from "@/components/IPmanagement/subnet/SubnetModule";
import Card from "@/components/DataCenterPage/Card";



const IPmanagementPage = () => {

    return (
        <div className={styles.pageContainer}>
            <div className={styles.heroSection}>
                {/* <NvBar /> */}
            </div>
            <div className={styles.backgroundGradient}>

                <Card className={styles.IPCard}>
                    <h1 className={styles.pageTitle}>IP Management</h1>
                    <SubnetModule />
                </Card>
            </div>
        </div>
    )
}

export default IPmanagementPage
