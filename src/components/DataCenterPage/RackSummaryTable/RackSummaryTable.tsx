import { useState } from "react"
import Button from "@/components/shared/Button"
import Card from "@/components/DataCenterPage/Card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/shared/Table"

import styles from "./RackSummaryTable.module.scss"
import { useDeleteDataCenterMutation } from "@/features/dataCenter/hooks/useDataCenter"
import CreateDCmodal from "@/components/DataCenterPage/DCmodal"
import { useGetRoomQuery } from "@/features/Rooms/hooks/useRoom"
import { useGetRackQuery } from "@/features/Racks/hooks/useRack"
import {
    useGetSubnetsQuery,
    useGetSubnetByIdQuery,
} from "@/features/subnet/hooks/useSubnet"
import { useSession } from "@features/user/hooks/useUser"
import { can } from "@lib/rbac"

import { AxiosError } from "axios"
import { DataCenter } from "@/features/dataCenter/types"
import { Room } from "@/features/Rooms/types"
import { Rack } from "@/features/Racks/types"

interface RoomCountCellProps {
    dcId: number
}

const RoomCountCell: React.FC<RoomCountCellProps> = ({ dcId }) => {
    const { data, isLoading, isError } = useGetRoomQuery()
    const {
        data: rack,
        isLoading: isLoading_rack,
        isError: isError_rack,
    } = useGetRackQuery()

    if (isLoading || isLoading_rack)
        return (
            <>
                <TableCell>Loading...</TableCell>
                <TableCell>Loading...</TableCell>
            </>
        )
    if (isError || isError_rack)
        return (
            <>
                <TableCell>Error</TableCell>
                <TableCell>Error</TableCell>
            </>
        )

    const roomData = data.filter((room: Room) => room.dataCenterId === dcId)
    const rackData = rack.filter((rack: Rack) =>
        roomData.some((room: Room) => room.id === rack.roomId)
    )

    return (
        <>
            <TableCell>{roomData.length}</TableCell>
            <TableCell>{rackData.length}</TableCell>
        </>
    )
}

interface SubnetCidrCellProps {
    subnetId?: number
}

const SubnetCidrCell: React.FC<SubnetCidrCellProps> = ({ subnetId }) => {
    if (!subnetId) return <TableCell>-</TableCell>

    const { data: subnet, isLoading, isError } = useGetSubnetByIdQuery(subnetId)

    if (isLoading) return <TableCell>Loading...</TableCell>
    if (isError) return <TableCell>Error</TableCell>

    return (
        <TableCell>
            <div>subnetID: {subnet?.id ?? "-"}</div>
            <div>{subnet?.cidr ?? "-"}</div>
        </TableCell>
    )
}

interface RackSummaryTableProps {
    dataCenters: DataCenter[]
    onAddToLeft: (dataCenter: DataCenter) => void
    onAddToRight: (dataCenter: DataCenter) => void
    onEditDataCenter?: (dataCenter: DataCenter) => void // Optional handler for edit
}

const RackSummaryTable: React.FC<RackSummaryTableProps> = ({
    dataCenters = [],
    onAddToLeft,
    onAddToRight,
    onEditDataCenter,
}) => {
    const { data: subnets } = useGetSubnetsQuery()

    const [isCreateModalOpen, setCreateModalOpen] = useState(false)
    const [selectedDC, setSelectedDC] = useState<DataCenter>() // optional, for editing

    //create
    const handleOpenCreateModal = () => {
        setSelectedDC(undefined) // reset for "create"
        setCreateModalOpen(true)
    }

    const handleCloseCreateModal = () => {
        setCreateModalOpen(false)
    }

    //delete
    const { mutate: deleteDC, isPending: isDeleting } =
        useDeleteDataCenterMutation()
    const handleDelete = (id: number) => {
        if (window.confirm("確定要刪除這個資料中心？")) {
            deleteDC(id)
        }
    }
    const { data: user } = useSession()
    const canOerate =
        can(user, "update", "DataCenter") || can(user, "delete", "DataCenter")
    return (
        <div>
            <Card className={styles.dataCenterCard}>
                <div className={styles.tableWrapper}>
                    {can(user, "create", "DataCenter") && (
                        <div className={styles.buttonWrapper}>
                            <Button
                                className={styles.addDCButton}
                                onClick={handleOpenCreateModal}
                            >
                                [+]dataCenter
                            </Button>
                        </div>
                    )}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>資料中心名稱</TableHead>
                                <TableHead>位置</TableHead>
                                <TableHead>Subnet CIDR</TableHead>
                                <TableHead>機房數量</TableHead>
                                <TableHead>機櫃數量</TableHead>
                                <TableHead>釘選至常用</TableHead>
                                {canOerate && <TableHead>操作</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dataCenters &&
                                dataCenters.map((dc, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{dc.name}</TableCell>
                                            <TableCell>{dc.location}</TableCell>
                                            <SubnetCidrCell
                                                subnetId={dc.subnetId}
                                            />
                                            <RoomCountCell dcId={dc.id!} />
                                            <TableCell>
                                                <div
                                                    className={
                                                        styles.favoriteGroup
                                                    }
                                                >
                                                    <Button
                                                        className={`${styles.infoButton} ${styles.favoriteButton}`}
                                                        onClick={() =>
                                                            onAddToLeft(dc)
                                                        }
                                                    >
                                                        釘選至左側
                                                    </Button>
                                                    <Button
                                                        className={`${styles.infoButton} ${styles.favoriteButton}`}
                                                        onClick={() =>
                                                            onAddToRight(dc)
                                                        }
                                                    >
                                                        釘選至右側
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            {canOerate && (
                                                <TableCell>
                                                    <div
                                                        className={
                                                            styles.favoriteGroup
                                                        }
                                                    >
                                                        {can(
                                                            user,
                                                            "update",
                                                            "DataCenter"
                                                        ) && (
                                                            <Button
                                                                className={`${styles.infoButton} ${styles.editButton}`}
                                                                onClick={() => {
                                                                    setSelectedDC(
                                                                        dc
                                                                    ) // 設定要編輯的資料中心
                                                                    setCreateModalOpen(
                                                                        true
                                                                    ) // 開啟 modal
                                                                }}
                                                            >
                                                                編輯
                                                            </Button>
                                                        )}
                                                        {can(
                                                            user,
                                                            "delete",
                                                            "DataCenter"
                                                        ) && (
                                                            <Button
                                                                className={`${styles.infoButton} ${styles.deleteButton}`}
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        dc.id!
                                                                    )
                                                                }
                                                                disabled={
                                                                    isDeleting
                                                                }
                                                            >
                                                                刪除
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    )
                                })}
                        </TableBody>
                    </Table>
                </div>
            </Card>
            <CreateDCmodal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                currentDataCenter={selectedDC}
            />
        </div>
    )
}

export default RackSummaryTable
