import { useState } from "react"
import { Link } from "react-router-dom"
import styles from "./IPmanagementPage.module.scss"

import Button from "@/components/shared/Button"
import { SubnetModule } from "@/components/IPmanagement/subnet/SubnetModule";
import { CreateSubnet } from "@/components/IPmanagement/createSubnet";
import Card from "@/components/DataCenterPage/Card";
import { useSession } from "@/features/user/hooks/useUser";



const IPmanagementPage = () => {
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    //create
    const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    };

    const { data: user, isLoggedIn } = useSession();
    console.log("current logged in user", user)

    const isAdmin = () => {
        return user?.role === "admin";
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
                        {isAdmin() && (
                            <Button
                                className={`${styles.createButton}`}
                                onClick={handleOpenCreateModal}
                            >
                                創建 Subnet
                            </Button>
                        )}
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
