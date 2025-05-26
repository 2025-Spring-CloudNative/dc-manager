import { useState, useEffect } from "react"
import Button from "@/components/shared/Button"
import Card from "@/components/DataCenterPage/Card"
import Separator from "@/components/shared/Separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/shared/Table"

import styles from "./PinnedDataCenters.module.scss"
import IpSelectModal from "@/components/DataCenterPage/ServiceSelectModal"
import MachineModal from "@/components/DataCenterPage/MachineModal"

import { useDeleteDataCenterMutation } from "@/features/dataCenter/hooks/useDataCenter"
import {
    useGetRoomQuery,
    useAddRoomMutation,
    useUpdateRoomMutation,
    useDeleteRoomMutation,
} from "@/features/Rooms/hooks/useRoom"

import {
    useGetRackQuery,
    useAddRackMutation,
    useDeleteRackMutation,
    useUpdateRackMutation,
} from "@/features/Racks/hooks/useRack"
import CreateModal from "@/components/shared/CreateModal"
import { DataCenter } from "@/features/dataCenter/types"
import { Room } from "@/features/Rooms/types"
import { Rack } from "@/features/Racks/types"
import {
    useGetMachinesQuery,
    useDeleteMachineMutation,
} from "@/features/Machine/hooks/useMachine"
import { Machine } from "@/features/Machine/types"
import ActionMenu from "@/components/DataCenterPage/ActionMenu"
import { useSession } from "@features/user/hooks/useUser"
import { can } from "@lib/rbac"

import { cn } from "@/lib/utils"

interface DataCenterComponentSectionProps {
    dataCenters: {
        left: DataCenter[]
        right: DataCenter[]
    }
}

const DataCenterComponentSection: React.FC<DataCenterComponentSectionProps> = ({
    dataCenters,
}) => {
    const [isRackmodalOpen, setRackModalOpen] = useState(false)
    const [focusedItem, setFocusedItem] = useState<{
        type: "Room" | "Rack" | null
        id: number | undefined
        mode: "clicked" | "hovered" | null
    }>({ type: null, id: undefined, mode: null })
    const [hoveredbuttonId, setHoveredbuttonId] = useState<number | null>(null)
    const [clickedId, setClickedId] = useState<number | null>(null)
    const [isRoommodalOpen, setCreateModalOpen] = useState(false)
    const [selectedDC, setSelectedDC] = useState<DataCenter | null>(null)
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
    const [isEditRoomOpen, setIsEditRoomOpen] = useState(false)
    const [isEditRackOpen, setIsEditRackOpen] = useState(false)
    const [selectedRack, setSelectedRack] = useState<Rack | null>(null)
    const [isIpSelectModalOpen, setIsIpSelectModalOpen] = useState(false)
    const [isMachineModalOpen, setIsMachineModalOpen] = useState(false)
    const { data: user } = useSession()

    // Consolidated state for all action menus
    const [actionMenuState, setActionMenuState] = useState<{
        type: "Room" | "Rack" | "Machine" | null
        target: Room | Rack | Machine | null
        pos: { top: number; left: number }
    }>({ type: null, target: null, pos: { top: 0, left: 0 } })

    const [editMachine, setEditMachine] = useState<Machine | null>(null)

    const { data: roomsData } = useGetRoomQuery()
    const { data: racksData } = useGetRackQuery()
    const { mutate: deleteRoombyID } = useDeleteRoomMutation()
    const { mutate: deleteRackbyID } = useDeleteRackMutation()
    const { mutate: deleteDC } = useDeleteDataCenterMutation()
    const { mutate: deleteMachineMutation } = useDeleteMachineMutation()
    const updateRoomMutation = useUpdateRoomMutation()
    const updateRackMutation = useUpdateRackMutation()
    const addRoomMutation = useAddRoomMutation()
    const addRackMutation = useAddRackMutation()

    const { data: machines = [], isError } = useGetMachinesQuery()

    useEffect(() => {
        if (isError) {
            console.error("❌ 無法取得 machines 資料")
        }
    }, [isError])

    const handleCloseRoommodal = () => {
        setCreateModalOpen(false)
        setSelectedDC(null)
    }

    const max_units = (dcId: number | null): string[] => {
        const rooms = filterRoomsByDataCenterId(dcId ?? undefined)
        if (!rooms || rooms.length === 0)
            return ["Unit", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
        const maxUnit = Math.max(0, ...rooms.map((room) => room.unit))
        return [
            "Unit",
            ...Array.from({ length: maxUnit }, (_, i) => (i + 1).toString()),
        ]
    }

    const getMachineInCell = (
        rackId: number,
        unit: number
    ): Machine | undefined => {
        return machines.find(
            (m) =>
                m.rackId === rackId &&
                unit >= m.startUnit &&
                unit <= m.startUnit + m.unit - 1
        )
    }
    const filterRoomsByDataCenterId = (dcId?: number): Room[] =>
        roomsData?.filter((r) => r.dataCenterId === dcId) ?? []
    const filterRacksByRoomId = (roomId?: number): Rack[] =>
        racksData
            ?.filter((r) => r.roomId === roomId)
            .sort((a, b) => a.id! - b.id!) ?? []

    const renderHeader = (item: Room | Rack, type: "Room" | "Rack") => {
        const isClicked =
            focusedItem.type === type &&
            focusedItem.id === item.id &&
            focusedItem.mode === "clicked"
        const isHovered =
            focusedItem.type === type &&
            focusedItem.id === item.id &&
            focusedItem.mode === "hovered"

        const handleClick = (e: React.MouseEvent) => {
            e.stopPropagation()
            const rect = (
                e.currentTarget as HTMLElement
            ).getBoundingClientRect()
            const pos = {
                top: rect.bottom + window.scrollY,
                left: rect.left + rect.width / 2 + window.scrollX,
            }
            const isSameItemClicked =
                actionMenuState.type === type &&
                actionMenuState.target?.id === item.id

            setActionMenuState(
                isSameItemClicked
                    ? { type: null, target: null, pos: { top: 0, left: 0 } }
                    : { type, target: item, pos }
            )
            setFocusedItem(
                isSameItemClicked
                    ? { type: null, id: undefined, mode: null }
                    : { type, id: item.id ?? undefined, mode: "clicked" }
            )
        }

        return (
            <TableHead
                key={`${type}-${item.id}`}
                colSpan={
                    type === "Room"
                        ? filterRacksByRoomId(item.id).length || 1
                        : undefined
                }
                className={cn(
                    type === "Room" ? styles.roomHeader : styles.rackHeader,
                    isClicked && styles.clicked
                )}
                onClick={handleClick}
                onMouseEnter={() =>
                    !isClicked &&
                    setFocusedItem({ type, id: item.id, mode: "hovered" })
                }
                onMouseLeave={() => {
                    if (
                        focusedItem.mode === "hovered" &&
                        focusedItem.id === item.id &&
                        actionMenuState.type === null
                    ) {
                        setFocusedItem({
                            type: null,
                            id: undefined,
                            mode: null,
                        })
                    }
                }}
            >
                <span
                    className={
                        type === "Room" ? styles.roomTitle : styles.rackTitle
                    }
                >
                    {isClicked || isHovered
                        ? `編輯${type === "Room" ? "Room" : "Rack"}`
                        : item.name}
                </span>
            </TableHead>
        )
    }

    const renderDataTable = (
        dataCentersList: DataCenter[],
        side: "left" | "right"
    ) => {
        return dataCentersList.map((dc) => (
            <div key={`dc-${side}-${dc.id}`} className={styles.tableContainer}>
                <div
                    className={cn(
                        styles.dcHeader,
                        hoveredbuttonId === dc.id && styles.dcHeaderHovered
                    )}
                    onMouseEnter={() => setHoveredbuttonId(dc.id!)}
                    onMouseLeave={() => {
                        setHoveredbuttonId(null)
                        if (clickedId === dc.id) setClickedId(null)
                    }}
                    onClick={(e) => {
                        e.stopPropagation()
                        if (hoveredbuttonId === dc.id) {
                            setClickedId((prevClickedId) =>
                                prevClickedId === dc.id ? null : dc.id!
                            )
                        }
                        // Close any open action menu when clicking DC header
                        setActionMenuState({
                            type: null,
                            target: null,
                            pos: { top: 0, left: 0 },
                        })
                        setFocusedItem({
                            type: null,
                            id: undefined,
                            mode: null,
                        })
                    }}
                >
                    {clickedId === dc.id && (
                        <div
                            className={styles.actionButtons}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {can(user, "delete", "DataCenter") && (
                                <Button
                                    className={styles.deletedc}
                                    onClick={() => deleteDC(dc.id!)}
                                >
                                    刪除DC
                                </Button>
                            )}
                            {can(user, "create", "DataCenter") && (
                                <Button
                                    className={styles.create_room}
                                    onClick={() => {
                                        setSelectedDC(dc)
                                        setCreateModalOpen(true)
                                    }}
                                >
                                    [+]Room
                                </Button>
                            )}
                        </div>
                    )}
                    <span className={styles.dcTitle}>
                        {hoveredbuttonId === dc.id || clickedId === dc.id
                            ? "編輯DC"
                            : dc.name}
                    </span>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead
                                className={styles.unitHeader}
                            ></TableHead>
                            {filterRoomsByDataCenterId(dc.id).map((room) =>
                                renderHeader(room, "Room")
                            )}
                        </TableRow>
                        <TableRow>
                            <TableHead className={styles.unitHeader}>
                                <span className={styles.unitTitle}>Unit</span>
                            </TableHead>
                            {filterRoomsByDataCenterId(dc.id).flatMap((room) =>
                                filterRacksByRoomId(room.id).map((rack) =>
                                    renderHeader(rack, "Rack")
                                )
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {max_units(dc.id!)
                            .slice(1)
                            .map((unit) => (
                                <TableRow key={`unit-row-${dc.id}-${unit}`}>
                                    <TableCell className={styles.unitHeader}>
                                        <span className={styles.unitTitle}>
                                            {unit}
                                        </span>
                                    </TableCell>
                                    {filterRoomsByDataCenterId(dc.id).flatMap(
                                        (room) =>
                                            filterRacksByRoomId(room.id).map(
                                                (rack) => {
                                                    const unitNum =
                                                        parseInt(unit)
                                                    const isDisabled =
                                                        room.unit < unitNum ||
                                                        rack.height < unitNum
                                                    const machineInThisCell =
                                                        getMachineInCell(
                                                            rack.id!,
                                                            unitNum
                                                        )
                                                    const isStartUnit =
                                                        machineInThisCell?.startUnit ===
                                                        unitNum

                                                    return (
                                                        <TableCell
                                                            key={`${dc.id}-${room.id}-${rack.id}-${unit}-${side}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation()

                                                                // Check if there's a machine in this cell
                                                                if (
                                                                    machineInThisCell
                                                                ) {
                                                                    const isSameMachineClicked =
                                                                        actionMenuState.type ===
                                                                            "Machine" &&
                                                                        actionMenuState
                                                                            .target
                                                                            ?.id ===
                                                                            machineInThisCell.id

                                                                    if (
                                                                        isSameMachineClicked
                                                                    ) {
                                                                        // If the same machine was clicked, close the menu
                                                                        setActionMenuState(
                                                                            {
                                                                                type: null,
                                                                                target: null,
                                                                                pos: {
                                                                                    top: 0,
                                                                                    left: 0,
                                                                                },
                                                                            }
                                                                        )
                                                                    } else {
                                                                        // If a different machine or no machine menu was open, open for this machine
                                                                        const rect =
                                                                            (
                                                                                e.currentTarget as HTMLElement
                                                                            ).getBoundingClientRect()
                                                                        const pos =
                                                                            {
                                                                                top:
                                                                                    rect.bottom +
                                                                                    window.scrollY,
                                                                                left:
                                                                                    rect.left +
                                                                                    rect.width /
                                                                                        2 +
                                                                                    window.scrollX,
                                                                            }
                                                                        setActionMenuState(
                                                                            {
                                                                                type: "Machine",
                                                                                target: machineInThisCell,
                                                                                pos,
                                                                            }
                                                                        )
                                                                    }
                                                                } else {
                                                                    // If no machine in this cell, ensure menu is closed
                                                                    setActionMenuState(
                                                                        {
                                                                            type: null,
                                                                            target: null,
                                                                            pos: {
                                                                                top: 0,
                                                                                left: 0,
                                                                            },
                                                                        }
                                                                    )
                                                                }
                                                            }}
                                                            className={cn(
                                                                styles.unitCell,
                                                                isDisabled &&
                                                                    styles.disabledCell,
                                                                machineInThisCell &&
                                                                    styles.hasMachine,
                                                                // Apply 'machineSelectedForMenu' class if this cell's machine is the target of the open menu
                                                                actionMenuState.type ===
                                                                    "Machine" &&
                                                                    actionMenuState
                                                                        .target
                                                                        ?.rackId ===
                                                                        rack.id &&
                                                                    actionMenuState
                                                                        .target
                                                                        ?.startUnit ===
                                                                        unitNum &&
                                                                    styles.machineSelectedForMenu
                                                            )}
                                                        >
                                                            {isStartUnit && (
                                                                <span
                                                                    className={
                                                                        styles.machineLabel
                                                                    }
                                                                >
                                                                    {
                                                                        machineInThisCell?.name
                                                                    }
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                    )
                                                }
                                            )
                                    )}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        ))
    }

    return (
        <>
            <Card className={styles.combinedComponentCard}>
                <div className={styles.headerButtonArea}></div>
                <div className={styles.titleArea}>
                    <div className={styles.titleWrapper}>
                        <Separator className={styles.leftSeparator} />
                        <h2 className={styles.title}>常用資料中心</h2>
                        <Separator className={styles.rightSeparator} />
                    </div>
                </div>
                <div className={styles.tablesWrapper}>
                    {renderDataTable(dataCenters.left, "left")}
                    {renderDataTable(dataCenters.right, "right")}
                </div>
            </Card>

            {/* Centralized Action Menu */}

            <div>
                {actionMenuState.type && actionMenuState.target && (
                    <div
                        style={{
                            position: "absolute",
                            top: `${actionMenuState.pos.top}px`,
                            left: `${actionMenuState.pos.left}px`,
                            zIndex: 1001,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ActionMenu
                            type={actionMenuState.type}
                            onDelete={() => {
                                if (
                                    actionMenuState.type === "Machine" &&
                                    actionMenuState.target
                                ) {
                                    deleteMachineMutation(
                                        actionMenuState.target.id!
                                    )
                                } else if (
                                    actionMenuState.type === "Room" &&
                                    actionMenuState.target
                                ) {
                                    deleteRoombyID(actionMenuState.target.id)
                                } else if (
                                    actionMenuState.type === "Rack" &&
                                    actionMenuState.target
                                ) {
                                    deleteRackbyID(actionMenuState.target.id)
                                }
                                setActionMenuState({
                                    type: null,
                                    target: null,
                                    pos: { top: 0, left: 0 },
                                })
                            }}
                            onAdd={
                                actionMenuState.type === "Room" ||
                                actionMenuState.type === "Rack"
                                    ? () => {
                                          if (
                                              actionMenuState.type === "Room" &&
                                              actionMenuState.target
                                          ) {
                                              setSelectedRoom(
                                                  actionMenuState.target as Room
                                              )
                                              setRackModalOpen(true)
                                          } else if (
                                              actionMenuState.type === "Rack" &&
                                              actionMenuState.target
                                          ) {
                                              setSelectedRack(
                                                  actionMenuState.target as Rack
                                              )
                                              setEditMachine(null)
                                              setIsMachineModalOpen(true)
                                          }
                                          setActionMenuState({
                                              type: null,
                                              target: null,
                                              pos: { top: 0, left: 0 },
                                          })
                                      }
                                    : undefined
                            }
                            onThird={() => {
                                if (
                                    actionMenuState.type === "Room" &&
                                    actionMenuState.target
                                ) {
                                    setSelectedRoom(
                                        actionMenuState.target as Room
                                    )
                                    setIsEditRoomOpen(true)
                                } else if (
                                    actionMenuState.type === "Rack" &&
                                    actionMenuState.target
                                ) {
                                    setSelectedRack(
                                        actionMenuState.target as Rack
                                    )
                                    setIsIpSelectModalOpen(true)
                                } else if (
                                    actionMenuState.type === "Machine" &&
                                    actionMenuState.target
                                ) {
                                    const machineToEdit =
                                        actionMenuState.target as Machine
                                    const rackOfMachine = racksData?.find(
                                        (r: Rack) =>
                                            r.id === machineToEdit.rackId
                                    )
                                    if (rackOfMachine) {
                                        setSelectedRack(rackOfMachine)
                                        setEditMachine(machineToEdit)
                                        setIsMachineModalOpen(true)
                                    }
                                }
                                setActionMenuState({
                                    type: null,
                                    target: null,
                                    pos: { top: 0, left: 0 },
                                })
                            }}
                            onForth={
                                actionMenuState.type === "Rack"
                                    ? () => {
                                          if (actionMenuState.target) {
                                              setSelectedRack(
                                                  actionMenuState.target as Rack
                                              )
                                              setIsEditRackOpen(true)
                                          }
                                          setActionMenuState({
                                              type: null,
                                              target: null,
                                              pos: { top: 0, left: 0 },
                                          })
                                      }
                                    : undefined
                            }
                            onCloseMenu={() =>
                                setActionMenuState({
                                    type: null,
                                    target: null,
                                    pos: { top: 0, left: 0 },
                                })
                            }
                        />
                    </div>
                )}
                {selectedDC && (
                    <CreateModal
                        isOpen={isRoommodalOpen}
                        onClose={handleCloseRoommodal}
                        title="新增Room"
                        fields={[
                            {
                                name: "name",
                                label: "Room名稱",
                                type: "text",
                                required: true,
                            },
                            {
                                name: "unit",
                                label: "Room高度",
                                type: "number",
                                defaultValue: 10,
                            },
                        ]}
                        mutation={addRoomMutation}
                        extraData={{ dataCenterId: selectedDC.id }}
                    />
                )}

                {selectedRoom && (
                    <CreateModal
                        isOpen={isRackmodalOpen}
                        onClose={() => {
                            setRackModalOpen(false)
                            setSelectedRoom(null)
                        }}
                        title="新增Rack"
                        fields={[
                            {
                                name: "name",
                                label: "Rack名稱",
                                type: "text",
                                required: true,
                            },
                            {
                                name: "height",
                                label: "Rack高度",
                                type: "number",
                                defaultValue: 10,
                            },
                            {
                                name: "tag",
                                label: "Rack tag",
                                type: "text",
                                required: true,
                            },
                        ]}
                        mutation={addRackMutation}
                        extraData={{ roomId: selectedRoom.id }}
                    />
                )}
                {selectedRoom && (
                    <CreateModal
                        isOpen={isEditRoomOpen}
                        onClose={() => {
                            setIsEditRoomOpen(false)
                            setSelectedRoom(null)
                        }}
                        title="修改Room"
                        fields={[
                            {
                                name: "name",
                                label: "Room名稱",
                                type: "text",
                                required: true,
                                defaultValue: selectedRoom.name,
                            },
                            {
                                name: "unit",
                                label: "Room高度",
                                type: "number",
                                required: true,
                                defaultValue: selectedRoom.unit,
                            },
                        ]}
                        mutation={updateRoomMutation}
                        extraData={{ id: selectedRoom.id }}
                    />
                )}
                {selectedRack && isIpSelectModalOpen && (
                    <IpSelectModal
                        isOpen={isIpSelectModalOpen}
                        onClose={() => {
                            setIsIpSelectModalOpen(false)
                            setSelectedRack(null)
                        }}
                        currentRack={selectedRack}
                    />
                )}
                {selectedRack && isEditRackOpen && (
                    <CreateModal
                        isOpen={isEditRackOpen}
                        onClose={() => {
                            setIsEditRackOpen(false)
                            setSelectedRack(null)
                        }}
                        title="修改Rack"
                        fields={[
                            {
                                name: "name",
                                label: "Rack 名稱",
                                type: "text",
                                required: true,
                                defaultValue: selectedRack.name,
                            },
                            {
                                name: "height",
                                label: "Rack 高度",
                                type: "number",
                                required: true,
                                defaultValue: selectedRack.height,
                            },
                            {
                                name: "tag",
                                label: "Rack tag",
                                type: "text",
                                required: true,
                                defaultValue: selectedRack.tag,
                            },
                        ]}
                        mutation={updateRackMutation}
                        extraData={{ id: selectedRack.id }}
                    />
                )}

                {/* Consolidated MachineModal for Add/Edit */}
                {selectedRack && isMachineModalOpen && (
                    <MachineModal
                        isOpen={isMachineModalOpen}
                        onClose={() => {
                            setIsMachineModalOpen(false)
                            setSelectedRack(null)
                            setEditMachine(null)
                        }}
                        rack={selectedRack}
                        machines={machines.filter(
                            (m: Machine) => m.rackId === selectedRack.id
                        )}
                        title={editMachine ? "修改Machine" : "新增Machine"}
                        editmachine={editMachine || undefined}
                    />
                )}
            </div>
        </>
    )
}

export default DataCenterComponentSection
