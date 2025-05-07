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
// import { DataCenter } from "@/components/data/rackData";
import { DataCenter } from "@/components/data/datacenter";

interface RackManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    side: "left" | "right";
    dataCenters: DataCenter;
    onSave?: (saveData: {
        rackName: string;
        rackHeight: string;
        selectedRackInfo: {
            dataCenterId: string;
            roomName: string;
            rackId: string;
            rackIndex: number;
            units: string[];
        } | null;
    }) => void;
}

const KEY_SEPARATOR = "__"; // Using a different separator for this version

const RackManagementModal: React.FC<RackManagementModalProps> = ({ isOpen, onClose, side, dataCenters, onSave }) => {
    const units = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]; // Different unit labels
    const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
    const [currentRackName, setCurrentRackName] = useState("");
    const [currentRackHeight, setCurrentRackHeight] = useState("");

    const handleCellSelect = (key: string) => {
        setSelectedCells((prev) => {
            const nextSet = new Set(prev);
            nextSet.has(key) ? nextSet.delete(key) : nextSet.add(key);
            console.log(side, key);
            return nextSet;
        });
    };

    const handleClose = () => {
        setSelectedCells(new Set()); // Flush selectedCells on close
        onClose();
    };

    const handleSave = () => {
        if (selectedCells.size === 0) {
            alert("Please select at least one unit.");
            return;
        }

        const selectedKeysArray = Array.from(selectedCells);
        let firstKeyParts: string[] | null = null;
        let allValid = true;
        const collectedUnits: string[] = [];
        let refDcId: string | null = null;
        let refRoomName: string | null = null;
        let refRackIndex: number | null = null;

        for (const key of selectedKeysArray) {
            const parts = key.split(KEY_SEPARATOR);
            if (parts.length !== 4) { // Expecting dcId, roomName, rackIndex, unit
                console.warn("Invalid key format:", key);
                allValid = false;
                break;
            }

            const [dcId, roomName, rackIndexStr, unit] = parts;
            const rackIndex = parseInt(rackIndexStr, 10);

            if (isNaN(rackIndex)) {
                console.warn("Invalid rack index in key:", key);
                allValid = false;
                break;
            }

            if (!firstKeyParts) {
                firstKeyParts = parts;
                refDcId = dcId;
                refRoomName = roomName;
                refRackIndex = rackIndex;
            } else if (dcId !== refDcId || roomName !== refRoomName || rackIndex !== refRackIndex) {
                allValid = false;
                break;
            }
            collectedUnits.push(unit);
        }

        if (allValid && refDcId !== null && refRoomName !== null && refRackIndex !== null) {
            const sortedUnits = collectedUnits.sort();
            // Basic continuity check (for demonstration)
            const areContinuous = sortedUnits.every((unit, index) => {
                if (index === 0) return true;
                return unit.charCodeAt(0) === sortedUnits[index - 1].charCodeAt(0) + 1;
            });

            if (!areContinuous) {
                alert("Selected units are not continuous.");
                return;
            }

            let foundRackId: string | null = null;
            const targetDc = dataCenters.find(dc => dc.id === refDcId);
            const targetRoom = targetDc?.rooms.find(room => room.name === refRoomName);
            if (targetRoom?.racks[refRackIndex]) {
                foundRackId = targetRoom.racks[refRackIndex];
            }

            if (foundRackId) {
                alert("Save Successful!");
                console.log("Save Data:", {
                    rackName: currentRackName,
                    rackHeight: currentRackHeight,
                    selectedRackInfo: {
                        dataCenterId: refDcId,
                        roomName: refRoomName,
                        rackId: foundRackId,
                        rackIndex: refRackIndex,
                        units: sortedUnits,
                    },
                });
                if (onSave) {
                    onSave({
                        rackName: currentRackName,
                        rackHeight: currentRackHeight,
                        selectedRackInfo: {
                            dataCenterId: refDcId,
                            roomName: refRoomName,
                            rackId: foundRackId,
                            rackIndex: refRackIndex,
                            units: sortedUnits,
                        },
                    });
                }
                handleClose(); // Call handleClose after successful save as well
            } else {
                alert("Could not find rack information.");
            }
        } else {
            alert("Invalid selection: All units must be from the same rack.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Rack Management</h2>
                <div className={styles.tableWithInputsWrapper}>
                    <div className={styles.inputColumn}>
                        <label>Rack Name</label>
                        <Input
                            type="text"
                            placeholder="Enter Rack Name"
                            className={styles.inputField}
                            value={currentRackName}
                            onChange={(e) => setCurrentRackName(e.target.value)}
                        />
                        <label>Rack Height</label>
                        <Input
                            type="text"
                            placeholder="Enter Rack Height"
                            className={styles.inputField}
                            value={currentRackHeight}
                            onChange={(e) => setCurrentRackHeight(e.target.value)}
                        />
                        <label>IP Address (Read Only)</label>
                        <Input
                            type="text"
                            placeholder="N/A"
                            className={styles.inputField}
                            readOnly
                        />
                    </div>
                    <div className={styles.tableWrapper}>
                        {dataCenters.map((center) => (
                            <Table key={`${side}-table-${center.id}`}>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead colSpan={1 + center.rooms.reduce((sum, room) => sum + room.racks.length, 0)} className={styles.dcHeader}>
                                            <span className={styles.dcTitle}>{center.id} </span>
                                        </TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={styles.unitHeader}></TableHead>
                                        {center.rooms.map((room, index) => (
                                            <TableHead key={`${side}-${center.id}-${index}`} colSpan={room.racks.length} className={styles.roomHeader}>
                                                <span className={styles.roomTitle}>{room.name}</span>
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={styles.unitHeader}><span className={styles.unitTitle}>Unit</span></TableHead>
                                        {center.rooms.flatMap((room) =>
                                            room.racks.map((rack, index) => (
                                                <TableHead key={`${side}-${center.id}-${room.name}-rack-${index}`} className={styles.rackHeader}>
                                                    <span className={styles.rackTitle}>{rack}</span>
                                                </TableHead>
                                            ))
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {units.map((unit) => (
                                        <TableRow key={unit}>
                                            <TableCell className={`${styles.unitHeader} ${styles.unitCell}`}>
                                                <span className={styles.unitTitle}>{unit}</span>
                                            </TableCell>
                                            {center.rooms.flatMap((room) =>
                                                room.racks.map((_rack, rackIndex) => {
                                                    const cellKey = `${center.id}${KEY_SEPARATOR}${room.name}${KEY_SEPARATOR}${rackIndex}${KEY_SEPARATOR}${unit}`;
                                                    const isSelected = selectedCells.has(cellKey);
                                                    return (
                                                        <TableCell
                                                            key={cellKey}
                                                            onClick={() => handleCellSelect(cellKey)}
                                                            className={`${styles.unitCell} ${isSelected ? styles.clickedCell : ""}`}
                                                        />
                                                    );
                                                })
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ))}
                    </div>
                </div>
                <div className={styles.modalActions}>
                    <Button onClick={handleSave}>Save</Button>
                    <Button onClick={handleClose} >Close</Button>
                </div>
            </div>
        </div>
    );
};

export default RackManagementModal;