import React, { useState } from "react";
import styles from "./RackManagementModal.module.scss";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/shared/Table";
import Input from "@/components/shared/Input/Input";
import Button from "@/components/shared/Button";
import { useGetRoomQuery } from "@/features/Rooms/hooks/useRoom";
import { useGetRackQuery } from "@/features/Racks/hooks/useRack";
import { DataCenter } from "@/components/data/datacenter";
import { Room } from "@/components/data/room";
import { Rack } from "@/components/data/rack";

interface RackManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    side: "left" | "right";
    currentDataCenter?: DataCenter | null; // Expecting a single DataCenter
    rooms: Room[] | undefined;
    racks: Rack[] | undefined;
    clickedCells: { [side: string]: Set<string> };
    handleCellClick: (side: "left" | "right", cellKey: string) => void;
    onSave?: (saveData: {
        rackName: string;
        rackHeight: string;
        selectedRackInfo: {
            dataCenterId: number;
            roomId: number;
            rackId: number;
            units: string[];
        } | null;
    }) => void;
}

const KEY_SEPARATOR = "__";

const RackManagementModal: React.FC<RackManagementModalProps> = ({
    isOpen,
    onClose,
    side,
    currentDataCenter,
    rooms,
    racks,
    clickedCells,
    handleCellClick,
    onSave,
}) => {
    const units = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
    const [currentRackName, setCurrentRackName] = useState("");
    const [currentRackHeight, setCurrentRackHeight] = useState("");
    const handleInternalCellSelect = (dcId: number, roomId: number, rackId: number, unit: string) => {
        const key = `${dcId}${KEY_SEPARATOR}${roomId}${KEY_SEPARATOR}${rackId}${KEY_SEPARATOR}${unit}`;
        setSelectedCells((prev) => {
            const nextSet = new Set(prev);
            nextSet.has(key) ? nextSet.delete(key) : nextSet.add(key);
            // console.log(side, key);
            return nextSet;
        });
        handleCellClick(side, key);
    };

    const handleCloseModal = () => {
        setSelectedCells(new Set());
        onClose();
    };

    const filterRoomsByDataCenterId = (dcId: number | undefined): Room[] => {
        return rooms ? rooms.filter((room) => room.dataCenterId === dcId) : [];
    };

    const filterRacksByRoomId = (roomId: number | undefined): Rack[] => {
        return racks ? racks.filter((rack) => rack.roomId === roomId) : [];
    };

    const renderRoomHeaders = (room: Room) => {
        const rackData = racks ? racks.filter((rack) => room.id === rack.roomId) : [];
        const rackCount = rackData.length;
        return (
            <TableHead key={room.id} colSpan={rackCount} className={styles.roomHeader}>
                <span className={styles.roomTitle}>{room.name}</span>
            </TableHead>
        );
    };

    const countTotalRacksInDC = (dcId: number | undefined): number => {
        if (!rooms || !racks || dcId === undefined) {
            return 1;
        }
        const roomsInDC = filterRoomsByDataCenterId(dcId);
        let totalRacks = 0;
        roomsInDC.forEach((room) => {
            totalRacks += filterRacksByRoomId(room.id).length;
        });
        return totalRacks + 1;
    };

    const handleSave = () => {
        if (selectedCells.size === 0) {
            alert("Please select at least one unit.");
            return;
        }

        if (!currentDataCenter) {
            alert("No data center selected.");
            return;
        }

        const selectedKeysArray = Array.from(selectedCells);
        let firstKeyParts: string[] | null = null;
        let allValid = true;
        const collectedUnits: string[] = [];
        let refDcId: number | null = null;
        let refRoomId: number | null = null;
        let refRackId: number | null = null;

        for (const key of selectedKeysArray) {
            const parts = key.split(KEY_SEPARATOR);
            if (parts.length !== 4) {
                console.warn("Invalid key format:", key);
                allValid = false;
                break;
            }

            const [dcIdStr, roomIdStr, rackIdStr, unit] = parts;
            const dcId = parseInt(dcIdStr, 10);
            const roomId = parseInt(roomIdStr, 10);
            const rackId = parseInt(rackIdStr, 10);

            if (isNaN(dcId) || isNaN(roomId) || isNaN(rackId)) {
                console.warn("Invalid ID in key:", key);
                allValid = false;
                break;
            }

            if (!firstKeyParts) {
                firstKeyParts = parts;
                refDcId = dcId;
                refRoomId = roomId;
                refRackId = rackId;
            } else if (dcId !== refDcId || roomId !== refRoomId || rackId !== refRackId) {
                allValid = false;
                break;
            }
            collectedUnits.push(unit);
        }

        if (allValid && refDcId !== null && refRoomId !== null && refRackId !== null) {
            const sortedUnits = collectedUnits.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
            const areContinuous = sortedUnits.every((unit, index) => {
                if (index === 0) return true;
                return parseInt(unit, 10) === parseInt(sortedUnits[index - 1], 10) + 1;
            });

            if (!areContinuous) {
                alert("Selected units are not continuous.");
                return;
            }

            alert("Save Successful!");
            console.log("Save Data:", {
                rackName: currentRackName,
                rackHeight: currentRackHeight,
                selectedRackInfo: {
                    dataCenterId: refDcId,
                    roomId: refRoomId,
                    rackId: refRackId,
                    units: sortedUnits,
                },
            });
            if (onSave) {
                onSave({
                    rackName: currentRackName,
                    rackHeight: currentRackHeight,
                    selectedRackInfo: {
                        dataCenterId: refDcId,
                        roomId: refRoomId,
                        rackId: refRackId,
                        units: sortedUnits,
                    },
                });
            }
            handleCloseModal();
        } else {
            alert("Invalid selection: All units must be from the same rack.");
        }
    };

    if (!isOpen || !currentDataCenter) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>編輯機櫃 - {side.charAt(0).toUpperCase() + side.slice(1)}</h2>
                <div className={styles.tableWithInputsWrapper}> 
                <div className={styles.inputColumn}>
                    <label>機櫃名稱</label>
                    <Input
                        type="text"
                        placeholder="輸入機櫃名稱"
                        className={styles.inputField}
                        value={currentRackName}
                        onChange={(e) => setCurrentRackName(e.target.value)}
                    />
                    <label>機櫃高度</label>
                    <Input
                        type="text"
                        placeholder="輸入機櫃高度"
                        className={styles.inputField}
                        value={currentRackHeight}
                        onChange={(e) => setCurrentRackHeight(e.target.value)}
                    />
                    <label>IP 位址 (唯讀)</label>
                    <Input
                        type="text"
                        placeholder="N/A"
                        className={styles.inputField}
                        readOnly
                    />
                </div>
                <div className={styles.tableContainer}>
                    <Table key={`rack-management-table-${currentDataCenter.id}`}>
                        <TableHeader>
                            <TableRow>
                                <TableHead
                                    colSpan={countTotalRacksInDC(currentDataCenter.id)}
                                    className={styles.dcHeader}
                                >
                                    <span className={styles.dcTitle}>{currentDataCenter.name}</span>
                                </TableHead>
                            </TableRow>
                            <TableRow>
                                <TableHead className={styles.unitHeader}></TableHead>
                                {filterRoomsByDataCenterId(currentDataCenter.id)?.map(renderRoomHeaders)}
                            </TableRow>
                            <TableRow>
                                <TableHead className={styles.unitHeader}>
                                    <span className={styles.unitTitle}>Unit</span>
                                </TableHead>
                                {filterRoomsByDataCenterId(currentDataCenter.id)?.flatMap((room) =>
                                    filterRacksByRoomId(room.id)?.map((rack) => (
                                        <TableHead key={rack.id} className={styles.rackHeader}>
                                            <span className={styles.rackTitle}>{rack.name}</span>
                                        </TableHead>
                                    ))
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {units.map((unit) => (
                                <TableRow key={unit}>
                                    <TableCell className={styles.unitHeader}>
                                        <span className={styles.unitTitle}>{unit}</span>
                                    </TableCell>
                                    {filterRoomsByDataCenterId(currentDataCenter.id)?.flatMap((room) =>
                                        filterRacksByRoomId(room.id)?.map((rack) => {
                                            const cellKey = `${currentDataCenter.id}${KEY_SEPARATOR}${room.id}${KEY_SEPARATOR}${rack.id}${KEY_SEPARATOR}${unit}`;
                                            const isSelected = selectedCells.has(cellKey);
                                            return (
                                                <TableCell
                                                    key={cellKey}
                                                    onClick={() => handleInternalCellSelect(currentDataCenter.id, room.id, rack.id, unit)}
                                                    className={`${styles.unitCell} ${isSelected ? styles.clickedCell : ""}`}
                                                />
                                            );
                                        })
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                </div>

                <div className={styles.modalActions}>
                    <Button onClick={handleSave}>儲存</Button>
                    <Button onClick={handleCloseModal}>關閉</Button>
                </div>
            </div>
        </div>
    );
};

export default RackManagementModal;