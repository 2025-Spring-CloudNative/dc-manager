import { useState } from "react"
import styles from "./IPmanagementPage.module.scss"

import Button from "@/components/shared/Button"
import { SubnetModule } from "@/components/IPmanagement/subnet/SubnetModule"
import { CreateSubnet } from "@/components/IPmanagement/createSubnet"
import Card from "@/components/DataCenterPage/Card"

import { useSession } from "@features/user/hooks/useUser"
import { can } from "@lib/rbac"

const IPmanagementPage = () => {
    const { data: user } = useSession()
    const [isCreateModalOpen, setCreateModalOpen] = useState(false)

    const canCreateSubnet = can(user, "create", "Subnet")

    //create
    const handleOpenCreateModal = () => {
        setCreateModalOpen(true)
    }

    const handleCloseCreateModal = () => {
        setCreateModalOpen(false)
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.heroSection}>{/* <NvBar /> */}</div>
            <div className={styles.backgroundGradient}>
                <Card className={styles.IPCard}>
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>IP Management</h1>
                        {canCreateSubnet ? (
                            <Button
                                className={`${styles.createButton}`}
                                onClick={handleOpenCreateModal}
                            >
                                創建 Subnet
                            </Button>
                        ): null}
                    </div>

                    <CreateSubnet isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} />

                    <SubnetModule />
                </Card>
            </div>
        </div>
    )
}

export default IPmanagementPage
