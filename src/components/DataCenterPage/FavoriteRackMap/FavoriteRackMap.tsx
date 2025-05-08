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
// import { DataCenter } from "@/components/data/rackData";
import { useGetDataCentersQuery } from "@/features/dataCenter/hooks/useDataCenter";
import { useGetRoomQuery } from "@/features/Rooms/hooks/useRoom";
import { useGetRackQuery } from "@/features/Racks/hooks/useRack";
import { DataCenter } from "@/components/data/datacenter";
import { Room } from "@/components/data/room";
import { Rack } from "@/components/data/rack";

interface DataCenterComponentSectionProps {
    leftDataCenters: DataCenter[];
    rightDataCenters: DataCenter[];
}

const DataCenterComponentSection: React.FC<DataCenterComponentSectionProps> = ({ leftDataCenters, rightDataCenters }) => {
    const units = ["Unit", "1", "2", "3", "4", "5", "6", "7", "8", "9",];
    const [clickedCells, setClickedCells] = useState<{ left: Set<string>; right: Set<string> }>({
        left: new Set(),
        right: new Set(),
    });
    const [isRackModalOpenLeft, setRackModalOpenLeft] = useState(false);
    const [isRackModalOpenRight, setRackModalOpenRight] = useState(false);

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

    const filterRoomsByDataCenterId = (dcId: number | undefined): Room[] => {
        return roomsData ? roomsData.filter((room: Room) => room.dataCenterId === dcId) : [];
    };

    const filterRacksByRoomId = (roomId: number | undefined): Rack[] => {
        return racksData ? racksData.filter((rack: Rack) => rack.roomId === roomId) : [];
    };

    const renderRoomHeaders = (rooms: Room) => {
        const rackData = racksData ? racksData.filter((rack: Rack) => rooms.id === rack.roomId) : [];
        const rackCount = rackData.length;

        return <TableHead key={rooms.id} colSpan={rackCount} className={styles.roomHeader}>
            <span className={styles.roomTitle}>{rooms.name}</span>
        </TableHead>;
    };

    // ✅ 修改 countTotalRooms 函式來計算 Rack 的總數
    const countTotalRacksInDC = (dcId: number | undefined): number => {
        if (!roomsData || !racksData || dcId === undefined) {
            return 0;
        }
        const roomsInDC = filterRoomsByDataCenterId(dcId);
        let totalRacks = 0;
        roomsInDC.forEach((room) => {
            totalRacks += filterRacksByRoomId(room.id).length;
        });
        return totalRacks+1;
    };

    console.log('Left Rooms for DC:', leftDataCenters.length > 0 ? leftDataCenters[0]?.id : null, filterRoomsByDataCenterId(leftDataCenters[0]?.id));
    console.log('Right Rooms for DC:', rightDataCenters.length > 0 ? rightDataCenters[0]?.id : null, filterRoomsByDataCenterId(rightDataCenters[0]?.id));

    return (
        <Card className={styles.combinedComponentCard}>
            <div className={styles.headerButtonArea}>
                <Button className={styles.editCabinetButton} onClick={() => setRackModalOpenLeft(true)}>編輯機櫃-Left</Button>
                <Button className={styles.editCabinetButton} onClick={() => setRackModalOpenRight(true)}>編輯機櫃-Right</Button>
            </div>
            <div className={styles.titleArea}>
                <div className={styles.titleWrapper}>
                    <Separator className={styles.leftSeparator} />
                    <h2 className={styles.title}>常用資料中心</h2>
                    <Separator className={styles.rightSeparator} />
                </div>
            </div>
            <div className={styles.tablesWrapper}>
                {leftDataCenters.map((dc) => (
                    <div key={`favorite-table-left-${dc.id}`} className={styles.tableContainer}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        colSpan={countTotalRacksInDC(dc.id)} // ✅ 使用新的函式計算 colSpan
                                        className={styles.dcHeader}
                                    >
                                        <span className={styles.dcTitle}>{dc.id} (Left)</span>
                                    </TableHead>
                                </TableRow>
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
                                            <TableHead
                                                key={`${room.name}-${rack.name}`}
                                                className={styles.rackHeader}
                                            >
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
                                                const cellKey = `${dc.id}-${unit}-${room.name}-${rack.name}-left`;
                                                const isClicked = clickedCells.left.has(cellKey);
                                                return (
                                                    <TableCell
                                                        key={cellKey}
                                                        onClick={() => handleCellClick("left", cellKey)}
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
                ))}

                {rightDataCenters.map((dc) => (
                    <div key={`favorite-table-right-${dc.id}`} className={styles.tableContainer}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        colSpan={countTotalRacksInDC(dc.id)} // ✅ 使用新的函式計算 colSpan
                                        className={styles.dcHeader}
                                    >
                                        <span className={styles.dcTitle}>{dc.id} (Right)</span>
                                    </TableHead>
                                </TableRow>
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
                                            <TableHead
                                                key={`${room.name}-${rack.name}`}
                                                className={styles.rackHeader}
                                            >
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
                                                const cellKey = `${dc.id}-${unit}-${room.name}-${rack}-right`;
                                                const isClicked = clickedCells.right.has(cellKey);
                                                return (
                                                    <TableCell
                                                        key={cellKey}
                                                        onClick={() => handleCellClick("right", cellKey)}
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
                ))}
            </div>
        </Card>
    );
};

export default DataCenterComponentSection;