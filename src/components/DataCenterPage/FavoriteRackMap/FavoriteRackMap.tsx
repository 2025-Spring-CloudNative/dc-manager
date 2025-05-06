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
import { DataCenter } from "@/components/data/rackData";

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

    const handleCellClick = (localSide: "left" | "right", cellKey: string) => {
        setClickedCells((prev) => {
            const newSet = new Set(prev[localSide]);
            newSet.has(cellKey) ? newSet.delete(cellKey) : newSet.add(cellKey);
            return { ...prev, [localSide]: newSet };
        });
    };

    return (
        <Card className={styles.combinedComponentCard}>

            <div className={styles.headerButtonArea}>
                <Button className={styles.editCabinetButton} onClick={() => setRackModalOpenLeft(true)}>編輯機櫃-Left</Button>
                <RackManagementModal
                    isOpen={isRackModalOpenLeft}
                    onClose={() => setRackModalOpenLeft(false)}
                    side="left"
                    dataCenters={leftDataCenters} // Pass leftDataCenters for the left modal
                    // onSave prop implementation if needed
                />
                <Button className={styles.editCabinetButton} onClick={() => setRackModalOpenRight(true)}>編輯機櫃-Right</Button>
                <RackManagementModal
                    isOpen={isRackModalOpenRight}
                    onClose={() => setRackModalOpenRight(false)}
                    side="right"
                    dataCenters={rightDataCenters} // Pass rightDataCenters for the right modal
                    // onSave prop implementation if needed
                />
            </div>

            <div className={styles.titleArea}>
                <div className={styles.titleWrapper}>
                    <Separator className={styles.leftSeparator} />
                    <h2 className={styles.title}>常用資料中心</h2>
                    <Separator className={styles.rightSeparator} />
                </div>
            </div>

            <div className={styles.tablesWrapper}>
                {/* Left Table */}
                    {leftDataCenters.map((center) => (
                        <div key={`favorite-table-left-${center.id}`} className={styles.tableContainer}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead
                                            colSpan={
                                                1 +
                                                center.rooms.reduce(
                                                    (sum, room) => sum + room.racks.length,
                                                    0
                                                )
                                            }
                                            className={styles.dcHeader}
                                        >
                                            <span className={styles.dcTitle}>{center.id} (Left)</span>
                                        </TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={styles.unitHeader}></TableHead>
                                        {center.rooms.map((room, roomIndex) => (
                                            <TableHead
                                                key={roomIndex}
                                                colSpan={room.racks.length}
                                                className={styles.roomHeader}
                                            >
                                                <span className={styles.roomTitle}>{room.name}</span>
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={styles.unitHeader}>
                                            <span className={styles.unitTitle}>Unit</span>
                                        </TableHead>
                                        {center.rooms.flatMap((room) =>
                                            room.racks.map((rack) => (
                                                <TableHead
                                                    key={`${room.name}-${rack}`}
                                                    className={styles.rackHeader}
                                                >
                                                    <span className={styles.rackTitle}>{rack}</span>
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
                                            {center.rooms.flatMap((room) =>
                                                room.racks.map((rack) => {
                                                    const cellKey = `${center.id}-${unit}-${room.name}-${rack}-left`;
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

                {/* Right Table */}
                    {rightDataCenters.map((center) => (
                        <div key={`favorite-table-right-${center.id}`} className={styles.tableContainer}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead
                                            colSpan={
                                                1 +
                                                center.rooms.reduce(
                                                    (sum, room) => sum + room.racks.length,
                                                    0
                                                )
                                            }
                                            className={styles.dcHeader}
                                        >
                                            <span className={styles.dcTitle}>{center.id} (Right)</span>
                                        </TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={styles.unitHeader}></TableHead>
                                        {center.rooms.map((room, roomIndex) => (
                                            <TableHead
                                                key={roomIndex}
                                                colSpan={room.racks.length}
                                                className={styles.roomHeader}
                                            >
                                                <span className={styles.roomTitle}>{room.name}</span>
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={styles.unitHeader}>
                                            <span className={styles.unitTitle}>Unit</span>
                                        </TableHead>
                                        {center.rooms.flatMap((room) =>
                                            room.racks.map((rack) => (
                                                <TableHead
                                                    key={`${room.name}-${rack}`}
                                                    className={styles.rackHeader}
                                                >
                                                    <span className={styles.rackTitle}>{rack}</span>
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
                                            {center.rooms.flatMap((room) =>
                                                room.racks.map((rack) => {
                                                    const cellKey = `${center.id}-${unit}-${room.name}-${rack}-right`;
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