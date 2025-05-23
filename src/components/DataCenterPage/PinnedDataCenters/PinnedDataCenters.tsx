import { useState, useRef, useEffect } from "react";
import Button from "@/components/shared/Button";
import Card from "@/components/DataCenterPage/Card";
import Separator from "@/components/shared/Separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/shared/Table";

import styles from "./PinnedDataCenters.module.scss";
import IpSelectModal from "@/components/DataCenterPage/ServiceSelectModal";
import MachineModal from "@/components/DataCenterPage/MachineModal";

// import { DataCenter } from "@/components/data/rackData";
import {
    useDeleteDataCenterMutation,
} from "@/features/dataCenter/hooks/useDataCenter";
import {
    useGetRoomQuery,
    useAddRoomMutation,
    useUpdateRoomMutation,
    useDeleteRoomMutation, // Ensure useDeleteRoomMutation is imported here
} from "@/features/Rooms/hooks/useRoom";

import {
    useGetRackQuery,
    useAddRackMutation,
    useDeleteRackMutation,
    useUpdateRackMutation
} from "@/features/Racks/hooks/useRack";
import CreateModal from "@/components/shared/CreateModal";
// import { useDeleteRoomMutation } from "@/features/Rooms/hooks/useRoom"; // Already imported above
import { DataCenter } from "@/features/dataCenter/types";
import { Room } from "@/features/Rooms/types";
import { Rack } from "@/features/Racks/types";
import { useGetMachinesQuery, useDeleteMachineMutation } from "@/features/Machine/hooks/useMachine";
import { Machine } from "@/features/Machine/types";
import ActionMenu from "@/components/DataCenterPage/ActionMenu";

// import for hover data center
import { cn } from "@/lib/utils";

// enable create room with room modal
interface DataCenterComponentSectionProps {
    dataCenters: {
        left: DataCenter[];
        right: DataCenter[];
    };
}


const DataCenterComponentSection: React.FC<DataCenterComponentSectionProps> = ({
    dataCenters,
}) => {
    const [clickedCells, setClickedCells] = useState<{ [side: string]: Set<string>; }>({ left: new Set(), right: new Set() });
    const [isRackmodalOpen, setRackModalOpen] = useState(false);
    const [overlayMenu, setOverlayMenu] = useState<{ type: "room" | "rack" | null; id: number | null; pos: { top: number; left: number }; }>({ type: null, id: null, pos: { top: 0, left: 0 } });
    const [focusedItem, setFocusedItem] = useState<{ type: "room" | "rack" | null; id: number | undefined; mode: "clicked" | "hovered" | null }>({ type: null, id: undefined, mode: null }); // id can be undefined
    // const [machines, setMachines] = useState<Machine[]>([]);
    const [hoveredbuttonId, setHoveredbuttonId] = useState<number | null>(null);
    const [clickedId, setClickedId] = useState<number | null>(null);
    const [isRoommodalOpen, setCreateModalOpen] = useState(false);
    const [selectedDC, setSelectedDC] = useState<DataCenter | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
    const [isEditRackOpen, setIsEditRackOpen] = useState(false);
    const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
    const [isIpSelectModalOpen, setIsIpSelectModalOpen] = useState(false);
    const [isMachineModalOpen, setIsMachineModalOpen] = useState(false);

    const { data: roomsData } = useGetRoomQuery();
    const { data: racksData } = useGetRackQuery();
    const { mutate: deleteRoombyID } = useDeleteRoomMutation();
    const { mutate: deleteRackbyID } = useDeleteRackMutation();
    const { mutate: deleteDC } = useDeleteDataCenterMutation();
    const { mutate: deleteMachineMutation } = useDeleteMachineMutation(); // Instantiate delete machine mutation
    const updateRoomMutation = useUpdateRoomMutation();
    const updateRackMutation = useUpdateRackMutation();

    const addRoomMutation = useAddRoomMutation();
    const addRackMutation = useAddRackMutation();

    const [overlayMachineMenu, setOverlayMachineMenu] = useState<{
        machine: Machine | null;
        pos: { top: number; left: number };
    }>({ machine: null, pos: { top: 0, left: 0 } });

    const [editMachine, setEditMachine] = useState<Machine | null>(null);

    const { data: machines = [], isLoading, isError } = useGetMachinesQuery();

    useEffect(() => {
        if (isError) {
            console.error("❌ 無法取得 machines 資料");
        }
    }, [isError]);

    const handleCloseRoommodal = () => {
        setCreateModalOpen(false);
        setSelectedDC(null);
    };

    const max_units = (dcId: number | null): string[] => {
        const rooms = filterRoomsByDataCenterId(dcId ?? undefined);
        if (!rooms || rooms.length === 0)
            return ["Unit", "1", "2", "3", "4", "5", "6", "7", "8", "9"]; // Default value if no rooms
        const maxUnit = Math.max(0, ...rooms.map((room) => room.unit)); // Ensure Math.max doesn't get -Infinity
        return [
            "Unit",
            ...Array.from({ length: maxUnit }, (_, i) => (i + 1).toString()),
        ];
    };

    const getMachineInCell = (rackId: number, unit: number): Machine | undefined => {
        return machines.find((m) => m.rackId === rackId && unit >= m.startUnit && unit <= m.startUnit + m.unit - 1);
    };
    const filterRoomsByDataCenterId = (dcId?: number): Room[] => roomsData?.filter((r) => r.dataCenterId === dcId) ?? [];
    const filterRacksByRoomId = (roomId?: number): Rack[] =>
        (racksData?.filter((r) => r.roomId === roomId)
            .sort((a, b) => a.id - b.id)
        ) ?? [];


    const renderHeader = (item: Room | Rack, type: "room" | "rack") => {
        const isClicked = focusedItem.type === type && focusedItem.id === item.id && focusedItem.mode === "clicked";
        const isHovered = focusedItem.type === type && focusedItem.id === item.id && focusedItem.mode === "hovered";

        const handleClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const pos = { top: rect.bottom + window.scrollY, left: rect.left + rect.width / 2 + window.scrollX };
            const isSameItemClicked = focusedItem.type === type && focusedItem.id === item.id && focusedItem.mode === "clicked";

            setFocusedItem(isSameItemClicked ? { type: null, id: undefined, mode: null } : { type, id: item.id ?? undefined, mode: "clicked" });
            setOverlayMenu(isSameItemClicked ? { type: null, id: null, pos: { top: 0, left: 0 } } : { type, id: item.id ?? null, pos });

            // Close machine menu if a room/rack header is clicked
            setOverlayMachineMenu({ machine: null, pos: { top: 0, left: 0 } });
        };

        const handleDelete = () => type === "room" ? deleteRoombyID(item.id) : deleteRackbyID(item.id);
        const handleAdd = () => {
            if (type === "room") {
                setSelectedRoom(item as Room);
                setRackModalOpen(true);
            } else { // type === "rack"
                setSelectedRack(item as Rack);
                setEditMachine(null); // Ensure we are in "add" mode for machine
                setIsMachineModalOpen(true);
            }
        };
        const handleCloseMenu = () => {
            setOverlayMenu({ type: null, id: null, pos: { top: 0, left: 0 } });
            setFocusedItem({ type: null, id: undefined, mode: null });
        };
        const handleThird = () => {
            if (type === "room") {
                setSelectedRoom(item as Room);
                setIsEditRoomOpen(true);
            } else { // type === "rack"
                setSelectedRack(item as Rack);
                setIsIpSelectModalOpen(true);
                console.log("選擇Service for Rack", item as Rack);
            }
        };
        const handleForth = () => { // Only for rack
            setSelectedRack(item as Rack);
            setIsEditRackOpen(true);
        };

        return (
            <TableHead
                key={`${type}-${item.id}`}
                colSpan={type === "room" ? filterRacksByRoomId(item.id).length || 1 : undefined} // Ensure colSpan is at least 1
                className={cn(type === "room" ? styles.roomHeader : styles.rackHeader, isClicked && styles.clicked)}
                onClick={handleClick}
                onMouseEnter={() => !isClicked && setFocusedItem({ type, id: item.id, mode: "hovered" })}
                onMouseLeave={() => {
                    if (focusedItem.mode === "hovered" && focusedItem.id === item.id) {
                        setFocusedItem({ type: null, id: undefined, mode: null });
                    }
                }}
            >
                <span className={type === "room" ? styles.roomTitle : styles.rackTitle}>
                    {(isClicked || isHovered) ? `編輯${type === "room" ? "Room" : "Rack"}` : item.name}
                </span>
                {overlayMenu.type === type && overlayMenu.id === item.id && (
                    <ActionMenu
                        type={type}
                        onDelete={handleDelete}
                        onAdd={handleAdd}
                        onThird={handleThird}
                        onForth={type === "rack" ? handleForth : undefined}
                        onCloseMenu={handleCloseMenu}
                    />
                )}
            </TableHead>
        );
    };


    const renderDataTable = (dataCentersList: DataCenter[], side: "left" | "right") => {
        return (dataCentersList.map((dc) => (
            <div key={`dc-${side}-${dc.id}`} className={styles.tableContainer}>
                <div className={cn(styles.dcHeader, hoveredbuttonId === dc.id && styles.dcHeaderHovered)}
                    onMouseEnter={() => setHoveredbuttonId(dc.id)}
                    onMouseLeave={() => { setHoveredbuttonId(null); if (clickedId === dc.id) setClickedId(null); }} // Clear clickedId if mouse leaves DC header unless an action keeps it open
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent click from propagating to document if we add global click listener later
                        if (hoveredbuttonId === dc.id) {
                            setClickedId(prevClickedId => prevClickedId === dc.id ? null : dc.id);
                        }
                        // Close other menus
                        setOverlayMenu({ type: null, id: null, pos: { top: 0, left: 0 } });
                        setFocusedItem({ type: null, id: undefined, mode: null });
                        setOverlayMachineMenu({ machine: null, pos: { top: 0, left: 0 } });
                    }}
                >
                    {clickedId === dc.id && (
                        <div className={styles.actionButtons} onClick={(e) => e.stopPropagation()}>
                            <Button className={styles.deletedc} onClick={() => deleteDC(dc.id)}>
                                刪除DC
                            </Button>
                            <Button className={styles.create_room} onClick={() => { setSelectedDC(dc); setCreateModalOpen(true); }}>
                                [+]Room
                            </Button>
                        </div>
                    )}
                    <span className={styles.dcTitle}>{(hoveredbuttonId === dc.id || clickedId === dc.id) ? "編輯DC" : dc.name}</span>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className={styles.unitHeader}></TableHead>
                            {filterRoomsByDataCenterId(dc.id).map((room) => renderHeader(room, "room"))}
                        </TableRow>
                        <TableRow>
                            <TableHead className={styles.unitHeader}><span className={styles.unitTitle}>Unit</span></TableHead>
                            {filterRoomsByDataCenterId(dc.id).flatMap((room) => filterRacksByRoomId(room.id).map((rack) => renderHeader(rack, "rack")))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {max_units(dc.id).slice(1).map((unit) => (
                            <TableRow key={`unit-row-${dc.id}-${unit}`}>
                                <TableCell className={styles.unitHeader}><span className={styles.unitTitle}>{unit}</span></TableCell>
                                {filterRoomsByDataCenterId(dc.id).flatMap((room) =>
                                    filterRacksByRoomId(room.id).map((rack) => {
                                        const cellKey = `${dc.id}-${room.id}-${rack.id}-${unit}-${side}`;
                                        const unitNum = parseInt(unit);
                                        const isDisabled = room.unit < unitNum || rack.height < unitNum;
                                        // const isClicked = clickedCells[side]?.has(cellKey); // Not used for machine menu logic directly
                                        const machineInThisCell = getMachineInCell(rack.id, unitNum);
                                        const isStartUnit = machineInThisCell?.startUnit === unitNum;

                                        return (
                                            <TableCell
                                                key={cellKey}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (machineInThisCell) {
                                                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                                        setOverlayMachineMenu({
                                                            machine: machineInThisCell,
                                                            pos: {
                                                                top: rect.bottom + window.scrollY,
                                                                left: rect.left + window.scrollX + rect.width / 2
                                                            },
                                                        });
                                                        // Close room/rack action menu if open
                                                        setOverlayMenu({ type: null, id: null, pos: { top: 0, left: 0 } });
                                                        setFocusedItem({ type: null, id: undefined, mode: null });
                                                    } else if (overlayMachineMenu.machine) {
                                                        // Clicked on an empty cell, close machine menu if it's open
                                                        setOverlayMachineMenu({ machine: null, pos: { top: 0, left: 0 } });
                                                    }
                                                }}
                                                className={cn(
                                                    styles.unitCell,
                                                    // isClicked && styles.clickedCell, // Not directly related to machine menu
                                                    isDisabled && styles.disabledCell,
                                                    machineInThisCell && styles.hasMachine,
                                                    overlayMachineMenu.machine && overlayMachineMenu.machine.rackId === rack.id && unitNum >= overlayMachineMenu.machine.startUnit && unitNum < overlayMachineMenu.machine.startUnit + overlayMachineMenu.machine.unit && styles.machineSelectedForMenu
                                                )}
                                            >
                                                {isStartUnit && <span className={styles.machineLabel}>{machineInThisCell.name}</span>}
                                            </TableCell>
                                        );
                                    })
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )));
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

            {/* Action Menu for Machines */}
            {overlayMachineMenu.machine && (
                <div
                    style={{
                        position: 'absolute',
                        top: `${overlayMachineMenu.pos.top}px`,
                        left: `${overlayMachineMenu.pos.left}px`,
                        zIndex: 1001,
                        transform: 'translateX(-50%)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <ActionMenu
                        type="machine"
                        onDelete={() => {
                            if (overlayMachineMenu.machine) {
                                deleteMachineMutation(overlayMachineMenu.machine.id!);
                                // onCloseMenu will be called internally by ActionMenu, which calls the below
                                // setOverlayMachineMenu({ machine: null, pos: { top: 0, left: 0 } }); 
                            }
                        }}
                        onThird={() => { // "Modify Host"
                            if (overlayMachineMenu.machine) {
                                const machineToEdit = overlayMachineMenu.machine;
                                const rackOfMachine = racksData?.find((r: Rack) => r.id === machineToEdit.rackId);
                                if (rackOfMachine) {
                                    setSelectedRack(rackOfMachine);
                                    setEditMachine(machineToEdit);
                                    setIsMachineModalOpen(true);
                                } else {
                                    console.error("❌ Rack not found for machine:", machineToEdit);
                                }
                                // onCloseMenu will be called internally by ActionMenu
                                // setOverlayMachineMenu({ machine: null, pos: { top: 0, left: 0 } });
                            }
                        }}
                        onCloseMenu={() => setOverlayMachineMenu({ machine: null, pos: { top: 0, left: 0 } })}
                    />
                </div>
            )}

            <div>
                {selectedDC && (
                    <CreateModal
                        isOpen={isRoommodalOpen}
                        onClose={handleCloseRoommodal}
                        title="新增房間"
                        fields={[
                            { name: "name", label: "房間名稱", type: "text", required: true },
                            { name: "unit", label: "房間高度", type: "number", defaultValue: 10, },
                        ]}
                        mutation={addRoomMutation}
                        extraData={{ dataCenterId: selectedDC.id }}
                    />
                )}

                {selectedRoom && (
                    <CreateModal
                        isOpen={isRackmodalOpen}
                        onClose={() => {
                            setRackModalOpen(false);
                            setSelectedRoom(null);
                        }}
                        title="新增Rack"
                        fields={[
                            { name: "name", label: "Rack名稱", type: "text", required: true },
                            { name: "height", label: "Rack高度", type: "number", defaultValue: 10, },
                            { name: "tag", label: "Rack tag", type: "text", required: true },
                        ]}
                        mutation={addRackMutation}
                        extraData={{ roomId: selectedRoom.id }}
                    />
                )}
                {selectedRoom && (
                    <CreateModal
                        isOpen={isEditRoomOpen}
                        onClose={() => {
                            setIsEditRoomOpen(false);
                            setSelectedRoom(null);
                        }}
                        title="修改Room"
                        fields={[
                            { name: "name", label: "房間名稱", type: "text", required: true, defaultValue: selectedRoom.name },
                            { name: "unit", label: "房間高度", type: "number", required: true, defaultValue: selectedRoom.unit },
                        ]}
                        mutation={updateRoomMutation}
                        extraData={{ id: selectedRoom.id }}
                    />
                )}
                {selectedRack && isIpSelectModalOpen && (
                    <IpSelectModal
                        isOpen={isIpSelectModalOpen}
                        onClose={() => {
                            setIsIpSelectModalOpen(false);
                            setSelectedRack(null);
                        }}
                        currentRack={selectedRack}
                    />
                )}
                {selectedRack && isEditRackOpen && (
                    <CreateModal
                        isOpen={isEditRackOpen}
                        onClose={() => {
                            setIsEditRackOpen(false);
                            setSelectedRack(null);
                        }}
                        title="修改Rack"
                        fields={[
                            { name: "name", label: "Rack 名稱", type: "text", required: true, defaultValue: selectedRack.name },
                            { name: "height", label: "Rack 高度", type: "number", required: true, defaultValue: selectedRack.height },
                            { name: "tag", label: "Rack tag", type: "text", required: true, defaultValue: selectedRack.tag },
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
                            setIsMachineModalOpen(false);
                            setSelectedRack(null);
                            setEditMachine(null); // Clear editMachine on close
                        }}
                        rack={selectedRack}
                        // Provide all machines for validation, modal can filter if needed internally or use rack.id for context
                        machines={machines.filter((m: Machine) => m.rackId === selectedRack.id)}


                        title={editMachine ? "修改Host" : "新增Host"}
                        editmachine={editMachine || undefined} // Pass undefined if null
                    />
                )}
            </div>
        </>
    );
};

export default DataCenterComponentSection;