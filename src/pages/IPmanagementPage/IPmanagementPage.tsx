import { useState } from "react"
import { Link } from "react-router-dom"
import styles from "./IPmanagementPage.module.scss"

import Button from "@/components/shared/Button"
import { SubnetModule } from "@/components/IPmanagement/subnet/SubnetModule";
import { CreateSubnet } from "@/components/IPmanagement/createSubnet";
import Card from "@/components/DataCenterPage/Card";



const IPmanagementPage = () => {
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    //create
    const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    };
    
    return (
        <div className={styles.pageContainer}>
            <div className={styles.heroSection}>
                {/* <NvBar /> */}
            </div>
            <div className={styles.backgroundGradient}>
                <Card className={styles.IPCard}>
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>IP Management</h1>
                        <Button
                            className={`${styles.createButton}`}
                            onClick={handleOpenCreateModal}
                        >
                            創建 Subnet
                        </Button>
                    </div>
                    
                    <CreateSubnet
                        isOpen={isCreateModalOpen}
                        onClose={handleCloseCreateModal}
                    />
                    
                    <SubnetModule />
                </Card>
            </div>
        </div>
    )
}

export default IPmanagementPage
