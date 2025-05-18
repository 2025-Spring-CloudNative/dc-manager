import { XIcon } from "lucide-react";
import { useState } from "react";
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
import IpSelectModal from "@/components/DataCenterPage/IpSelectModal";
import CreateDCmodal from "@/components/DataCenterPage/DCmodal";
// import { DataCenter } from "@/components/data/rackData";
import { useGetDataCentersQuery, useDeleteDataCenterMutation} from "@/features/dataCenter/hooks/useDataCenter";
import { useGetRoomQuery, useAddRoomMutation  } from "@/features/Rooms/hooks/useRoom";
import { useGetRackQuery } from "@/features/Racks/hooks/useRack";
import { DataCenter } from "@/components/data/datacenter";
import { Room } from "@/components/data/room";
import { Rack } from "@/components/data/rack";

// import for hover data center
import { cn } from "@/lib/utils";

// enable create room with room modal
import RoomModal from "@/components/DataCenterPage/Roommodal";
interface DataCenterComponentSectionProps {
    dataCenters: {
        left: DataCenter[];
        right: DataCenter[];
    };
}

const DataCenterComponentSection: React.FC<DataCenterComponentSectionProps> = ({ dataCenters }) => {
    const units = ["Unit", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const [clickedCells, setClickedCells] = useState<{ [side: string]: Set<string> }>({
        left: new Set(),
        right: new Set(),
    });
    const [isRackModalOpen, setRackModalOpen] = useState<{ [side: string]: boolean }>({
        left: false,
        right: false,
    });

    // ✅ 在元件頂層呼叫 useQuery 來獲取房間和機櫃資料
    const { data: roomsData, isLoading: isLoadingRooms, isError: isErrorRooms } = useGetRoomQuery();
    const { data: racksData, isLoading: isLoadingRacks, isError: isErrorRacks } = useGetRackQuery();

    const handleCellClick = (localSide: "left" | "right", cellKey: string) => {
        setClickedCells((prev) => {
            const newSet = new Set(prev[localSide]);
            newSet.has(cellKey) ? newSet.delete(cellKey) : newSet.add(cellKey);
            return { ...prev, [localSide]: newSet };
        });
    };
    console.log('isRackModalOpen:', isRackModalOpen);

    const filterRoomsByDataCenterId = (dcId: number | undefined): Room[] => {
        return roomsData ? roomsData.filter((room: Room) => room.dataCenterId === dcId) : [];
    };

    const filterRacksByRoomId = (roomId: number | undefined): Rack[] => {
        return racksData ? racksData.filter((rack: Rack) => rack.roomId === roomId) : [];
    };

    const renderRoomHeaders = (rooms: Room) => {
        const rackData = racksData ? racksData.filter((rack: Rack) => rooms.id === rack.roomId) : [];
        const rackCount = rackData.length;

        return (
            <TableHead key={rooms.id} colSpan={rackCount} className={styles.roomHeader}>
                <span className={styles.roomTitle}>{rooms.name}</span>
            </TableHead>
        );
    };

    // ✅ 修改 countTotalRooms 函式來計算 Rack 的總數
    const countTotalRacksInDC = (dcId: number | undefined): number => {
        if (!roomsData || !racksData || dcId === undefined) {
            return 1; // Include the Unit column
        }
        const roomsInDC = filterRoomsByDataCenterId(dcId);
        let totalRacks = 0;
        roomsInDC.forEach((room) => {
            totalRacks += filterRacksByRoomId(room.id).length;
        });
        return totalRacks + 1; // Plus one for the Unit column
    };

    const countTotalRoomsInDC = (dcId: number | undefined): number => {
        if (!roomsData || dcId === undefined) {
            return 1; // Include the Unit column
        }
        const roomsInDC = filterRoomsByDataCenterId(dcId);
        return roomsInDC.length + 1; // Plus one for the Unit column
    };

    const { mutate: deleteDC, isLoading: isDeleting } = useDeleteDataCenterMutation();
    const handleDelete = (id: number) => {
    if (window.confirm("確定要刪除這個資料中心？")) {
        deleteDC(id);
    }
    };

    const { mutate: addRoom, isLoading: isAddingRoom } = useAddRoomMutation();
    const handleEdit = (id: number) => {
        const roomName = "room_test";
        const unit = 9;
        if (roomName && unit) {
            addRoom({ name: roomName, unit: unit, dataCenterId: id });
        }
    }


    const [hoveredbuttonId, setHoveredbuttonId] = useState<number | null>(null);
    const [clickedId, setClickedId] = useState<number | null>(null);

    // handel roommodal
    const [isRoommodalOpen, setCreateModalOpen] = useState(false);
    const [ selectedDC, setSelectedDC] = useState<DataCenter | null>(null); // optional, for editing

    const handleOpenRoommodal = () => {
        setSelectedDC(null); // reset for "create"
        setCreateModalOpen(true);
    };

    const handleCloseRoommodal = () => {
        setCreateModalOpen(false);
    };
    
    const renderDataTable = (dataCentersList: DataCenter[], side: "left" | "right") => (
        // const [isCreateModalOpen, setCreateModalOpen] = useState(false);
        
        dataCentersList.map((dc) => (
            
            <div key={`favorite-table-${side}-${dc.id}`} className={styles.tableContainer}>
    
                {/* ✅ Custom header placed ABOVE the table */}
                <div
                className={cn(
                    styles.dcHeader,
                    hoveredbuttonId === dc.id && styles.dcHeaderHovered
                )}
                onMouseEnter={() => setHoveredbuttonId(dc.id)}
                onMouseLeave={() => {
                    setHoveredbuttonId(null);
                    setClickedId(null);
                }}
                onClick={() => {
                    if (hoveredbuttonId === dc.id) setClickedId(dc.id);
                }}
                >
                <div className={styles.dcHeaderContent}>
                    {clickedId === dc.id && (
                    <div className={styles.actionButtons}>
                        <Button
                        className={styles.deletedc}
                        onClick={() => handleDelete(dc.id)}
                        disabled={isDeleting}
                        >
                        刪除DC
                        </Button>
                        <Button
                        className={styles.create_room}
                        onClick={() => {
                            setSelectedDC(dc);
                            setCreateModalOpen(true);
                        }}
                        disabled={isAddingRoom}
                        >
                        [+]Room
                        </Button>
                    </div>
                    )}
                    <span className={styles.dcTitle}>
                    {hoveredbuttonId === dc.id ? "編輯DC" : dc.name}
                    </span>
                </div>
                </div>
                <Table>
                    <TableHeader>
                        
                        <TableRow>
                            <TableHead className={styles.unitHeader}></TableHead>
                            {filterRoomsByDataCenterId(dc.id).map((room) => renderRoomHeaders(room))}
                        </TableRow>
                        <TableRow>
                            <TableHead className={styles.unitHeader}>
                                <span className={styles.unitTitle}>Unit</span>
                            </TableHead>
                            {filterRoomsByDataCenterId(dc.id).flatMap((room) =>
                                filterRacksByRoomId(room.id).map((rack) => (
                                    <TableHead key={`${room.name}-${rack.name}`} className={styles.rackHeader}>
                                        <span className={styles.rackTitle}>{rack.name}</span>
                                    </TableHead>
                                ))
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {units.slice(1).map((unit) => (
                            <TableRow key={unit}>
                                <TableCell className={styles.unitHeader}>
                                    <span className={styles.unitTitle}>{unit}</span>
                                </TableCell>
                                {filterRoomsByDataCenterId(dc.id).flatMap((room) =>
                                    filterRacksByRoomId(room.id).map((rack) => {
                                        const cellKey = `${dc.id}-${unit}-${room.name}-${rack.name}-${side}`;
                                        const isClicked = clickedCells[side]?.has(cellKey);
                                        return (
                                            <TableCell
                                                key={cellKey}
                                                onClick={() => handleCellClick(side, cellKey)}
                                                className={`${styles.unitCell} ${isClicked ? styles.clickedCell : ""}`}
                                            />
                                        );
                                    })
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        ))
    );

    return (
        <>
        <Card className={styles.combinedComponentCard}>
            <div className={styles.headerButtonArea}>
                <Button className={styles.editCabinetButton} onClick={() => setRackModalOpen((prev) => ({ ...prev, left: true }))}>
                    編輯機櫃-Left
                </Button>
                
                <Button className={styles.editCabinetButton} onClick={() => setRackModalOpen((prev) => ({ ...prev, right: true }))}>
                    編輯機櫃-Right
                </Button>
            </div>
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
            {isRackModalOpen.left && dataCenters.left[0] && (
                <RackManagementModal
                    isOpen={isRackModalOpen.left}
                    onClose={() => setRackModalOpen((prev) => ({ ...prev, left: false }))}
                    side="left"
                    currentDataCenter={dataCenters.left[0]}
                    rooms={roomsData} // Pass the fetched rooms data
                    racks={racksData} // Pass the fetched racks data
                    clickedCells={clickedCells}
                    handleCellClick={handleCellClick}
                    // onSave={} // Your save function
                />
            )}
            {isRackModalOpen.right && dataCenters.right[0] && (
                <RackManagementModal
                    isOpen={isRackModalOpen.right}
                    onClose={() => setRackModalOpen((prev) => ({ ...prev, right: false }))}
                    side="right"
                    currentDataCenter={dataCenters.right[0]}
                    rooms={roomsData} // Pass the fetched rooms data
                    racks={racksData} // Pass the fetched racks data
                    clickedCells={clickedCells}
                    handleCellClick={handleCellClick}
                    // onSave={} // Your save function
                />
            )}
        <div>
            <RoomModal
                isOpen={isRoommodalOpen}
                onClose={handleCloseRoommodal}
                currentDataCenter={selectedDC}
            />
        </div>
        </>
    );
};

export default DataCenterComponentSection;