import { XIcon } from "lucide-react";
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

import styles from "./FavoriteRackMap.module.scss";
import RackManagementModal from "@/components/DataCenterPage/RackManagementModal";
import IpSelectModal from "@/components/DataCenterPage/ServiceSelectModal";
import CreateDCmodal from "@/components/DataCenterPage/DCmodal";
import ManageMachineModal from "@/components/DataCenterPage/MachineModal";

// import { DataCenter } from "@/components/data/rackData";
import {
    useGetDataCentersQuery,
    useDeleteDataCenterMutation,
} from "@/features/dataCenter/hooks/useDataCenter";
import {
    useGetRoomQuery,
    useAddRoomMutation,
    useUpdateRoomMutation
} from "@/features/Rooms/hooks/useRoom";

import {
    useGetRackQuery,
    useAddRackMutation,
    useDeleteRackMutation,
    useUpdateRackMutation
} from "@/features/Racks/hooks/useRack";
import CreateModal from "@/components/shared/CreateModal";
import { useDeleteRoomMutation } from "@/features/Rooms/hooks/useRoom";
import { DataCenter } from "@/features/dataCenter/types";
import { Room } from "@/features/Rooms/types";
import { Rack } from "@/features/Racks/types";
import { useGetMachinesQuery } from "@/features/Machine/hooks/useMachine"; // 你自己定義的 api 檔案
import { Machine } from "@/features/Machine/types"; // machine 型別


// import for hover data center
import { cn } from "@/lib/utils";

// enable create room with room modal
interface DataCenterComponentSectionProps {
    dataCenters: {
        left: DataCenter[];
        right: DataCenter[];
    };
}
const ActionMenu: React.FC<{
    type: "room" | "rack";
    onDelete: () => void;
    onAdd?: () => void;
    onThird?: () => void;
    onForth?: () => void;
    onCloseMenu: () => void;
}> = ({ type, onDelete, onAdd, onThird, onForth, onCloseMenu }) => {
    return (
        <div
            className={styles.roomButtonEdit}
            style={{ position: "absolute", zIndex: 100 }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className={styles.roomCtrlMenu}>
                <button className={styles.delRoom} onClick={() => { onDelete(); onCloseMenu(); }}>
                    <span className={styles.subButtonTitle}>{`刪除${type === "room" ? "Room" : "Rack"}`}</span>
                </button>
                {onAdd && (
                    <button className={styles.addRack} onClick={() => { onAdd(); onCloseMenu(); }}>
                        <span className={styles.subButtonTitle}>{type === "room" ? "[+]Rack" : "[+]Host"}</span>
                    </button>
                )}
                {onThird && (
                    <button className={styles.selectService} onClick={() => { onThird(); onCloseMenu(); }}>
                        <span className={styles.subButtonTitle}>
                            {type === "room" ? "修改Room" : "選擇Service"}
                        </span>
                    </button>
                )}
                {type === "rack" && onForth && (
                    <button className={styles.selectService} onClick={() => { onForth(); onCloseMenu(); }}>
                        <span className={styles.subButtonTitle}>
                            修改Rack
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};


const DataCenterComponentSection: React.FC<DataCenterComponentSectionProps> = ({
    dataCenters,
}) => {
    const [clickedCells, setClickedCells] = useState<{ [side: string]: Set<string>; }>({ left: new Set(), right: new Set() });
    const [isRackmodalOpen, setRackModalOpen] = useState(false);
    const [overlayMenu, setOverlayMenu] = useState<{ type: "room" | "rack" | null; id: number | null; pos: { top: number; left: number }; }>({ type: null, id: null, pos: { top: 0, left: 0 } });
    const [focusedItem, setFocusedItem] = useState<{ type: "room" | "rack" | null; id: number | undefined; mode: "clicked" | "hovered" | null }>({ type: null, id: null, mode: null });
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
    const handleCloseRoommodal = () => {
        setCreateModalOpen(false);
        setSelectedDC(null);
    };
    const { data: roomsData } = useGetRoomQuery();
    const { data: racksData } = useGetRackQuery();
    const { mutate: deleteRoombyID } = useDeleteRoomMutation();
    const { mutate: deleteRackbyID } = useDeleteRackMutation();
    const { mutate: deleteDC } = useDeleteDataCenterMutation();
    const updateRoomMutation = useUpdateRoomMutation();
    const updateRackMutation = useUpdateRackMutation();

    const roomMutation = useAddRoomMutation();
    const rackMutation = useAddRackMutation();

    const { data: machines = [], isLoading, isError } = useGetMachinesQuery();

    useEffect(() => {
        if (isError) {
            console.error("❌ 無法取得 machines 資料");
        }
    }, [isError]);
    const max_units = (dcId: number | null): string[] => {
        const rooms = filterRoomsByDataCenterId(dcId ?? undefined);
        if (!rooms || rooms.length === 0)
            return ["Unit", "1", "2", "3", "4", "5", "6", "7", "8", "9"]; // Default value if no rooms
        const maxUnit = Math.max(...rooms.map((room) => room.unit));
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
            .sort((a, b) => a.id - b.id) // ✅ 根據 id 排序，或可改用 name
        ) ?? [];


    const renderHeader = (item: Room | Rack, type: "room" | "rack", parent?: Room) => {
        const isClicked = focusedItem.type === type && focusedItem.id === item.id && focusedItem.mode === "clicked";
        const isHovered = focusedItem.type === type && focusedItem.id === item.id && focusedItem.mode === "hovered";

        const handleClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const pos = { top: rect.bottom + window.scrollY, left: rect.left + rect.width / 2 + window.scrollX };
            const isSame = isClicked;
            setFocusedItem(isSame ? { type: null, id: undefined, mode: null } : { type, id: item.id ?? undefined, mode: "clicked" });
            setOverlayMenu(isSame ? { type: null, id: null, pos: { top: 0, left: 0 } } : { type, id: item.id ?? null, pos });
        };



        const handleDelete = () => type === "room" ? deleteRoombyID(item.id) : deleteRackbyID(item.id);
        const handleAdd = () => type === "room" ? (setSelectedRoom(item as Room), setRackModalOpen(true)) : (setSelectedRack(item as Rack), setIsMachineModalOpen(true));
        const handleCloseMenu = () => { setOverlayMenu({ type: null, id: null, pos: { top: 0, left: 0 } }); setFocusedItem({ type: null, id: null, mode: null }); };
        const handleThird = () => {
            if (type === "room") {
                setSelectedRoom(item as Room);
                setIsEditRoomOpen(true);
            } else {
                setSelectedRack(item as Rack);
                setIsIpSelectModalOpen(true);
                console.log("選擇Service for Rack", item as Rack);
            }
        };
        const handleForth = () => {
            setSelectedRack(item as Rack);
            setIsEditRackOpen(true);
        };



        return (
            <TableHead
                key={item.id}  // ✅ 直接用 ID 作為 key
                colSpan={type === "room" ? filterRacksByRoomId(item.id).length : undefined}
                className={cn(type === "room" ? styles.roomHeader : styles.rackHeader, isClicked && styles.clicked)}
                onClick={handleClick}
                onMouseEnter={() => !isClicked && setFocusedItem({ type, id: item.id, mode: "hovered" })}
                onMouseLeave={() => !isClicked && setFocusedItem({ type: null, id: null, mode: null })}
            >
                <span className={type === "room" ? styles.roomTitle : styles.rackTitle}>
                    {(isClicked || isHovered) ? `編輯${type === "room" ? "Room" : "Rack"}` : item.name}
                </span>
                {overlayMenu.type === type && overlayMenu.id === item.id && (
                    <ActionMenu type={type} onDelete={handleDelete} onAdd={handleAdd} onThird={handleThird} onForth={handleForth} onCloseMenu={handleCloseMenu} />
                )}
            </TableHead>
        );
    };


    const renderDataTable = (dataCentersList: DataCenter[], side: "left" | "right") => dataCentersList.map((dc) => (
        <div key={`dc-${side}-${dc.id}`} className={styles.tableContainer}>
            <div className={cn(styles.dcHeader, hoveredbuttonId === dc.id && styles.dcHeaderHovered)}
                onMouseEnter={() => setHoveredbuttonId(dc.id)}
                onMouseLeave={() => { setHoveredbuttonId(null); setClickedId(null); }}
                onClick={() => hoveredbuttonId === dc.id && setClickedId(dc.id)}>
                {clickedId === dc.id && (
                    <div className={styles.actionButtons}>
                        <Button className={styles.deletedc} onClick={() => deleteDC(dc.id)}>
                            刪除DC
                        </Button>
                        <Button className={styles.create_room} onClick={() => { setSelectedDC(dc); setCreateModalOpen(true); }}>
                            [+]Room
                        </Button>
                    </div>
                )}
                <span className={styles.dcTitle}>{hoveredbuttonId === dc.id ? "編輯DC" : dc.name}</span>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className={styles.unitHeader}></TableHead>
                        {filterRoomsByDataCenterId(dc.id).map((room) => renderHeader(room, "room"))}
                    </TableRow>
                    <TableRow>
                        <TableHead className={styles.unitHeader}><span className={styles.unitTitle}>Unit</span></TableHead>
                        {filterRoomsByDataCenterId(dc.id).flatMap((room) => filterRacksByRoomId(room.id).map((rack) => renderHeader(rack, "rack", room)))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {max_units(dc.id).slice(1).map((unit) => (
                        <TableRow key={unit}>
                            <TableCell className={styles.unitHeader}><span className={styles.unitTitle}>{unit}</span></TableCell>
                            {filterRoomsByDataCenterId(dc.id).flatMap((room) =>
                                filterRacksByRoomId(room.id).map((rack) => {
                                    const cellKey = `${dc.id}-${unit}-${room.id}-${rack.id}-${side}`;

                                    const unitNum = parseInt(unit);

                                    // 判斷條件：若房間高度或 rack 高度不足，則 disable
                                    const isDisabled = room.unit < unitNum || rack.height < unitNum;

                                    const isClicked = clickedCells[side]?.has(cellKey);
                                    const machineInThisCell = getMachineInCell(rack.id, unitNum);
                                    const isStartUnit = machineInThisCell?.startUnit === unitNum;

                                    return (
                                        <TableCell
                                            key={cellKey}
                                            onClick={isDisabled ? undefined : () => setClickedCells((prev) => {
                                                const newSet = new Set(prev[side]);
                                                newSet.has(cellKey) ? newSet.delete(cellKey) : newSet.add(cellKey);
                                                return { ...prev, [side]: newSet };
                                            })}
                                            className={cn(
                                                styles.unitCell,
                                                isClicked && styles.clickedCell,
                                                isDisabled && styles.disabledCell,
                                                machineInThisCell && styles.hasMachine
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
    ));
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
                        mutation={roomMutation}
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
                        mutation={rackMutation}
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
                            // { name: "dataCenterId", label: "資料中心 ID", type: "number", required: false, defaultValue: selectedRoom.dataCenterId, disabled: true },
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
                            // { name: "dataCenterId", label: "資料中心 ID", type: "number", required: false, defaultValue: selectedRack.dataCenterId, disabled: true },
                        ]}
                        mutation={updateRackMutation}
                        extraData={{ id: selectedRack.id }}
                    />
                )}
                {selectedRack && isMachineModalOpen && (
                    <ManageMachineModal
                        isOpen={isMachineModalOpen}
                        onClose={() => {
                            setIsMachineModalOpen(false);
                            setSelectedRack(null);
                        }}
                        rack={selectedRack}
                        machines={machines.filter((m: Machine) => m.rackId === selectedRack.id)}

                    />
                )}


            </div>
        </>
    );
};

export default DataCenterComponentSection;
