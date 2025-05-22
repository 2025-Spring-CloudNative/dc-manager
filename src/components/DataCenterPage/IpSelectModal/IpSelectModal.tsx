import React, { useState } from "react";
import styles from "./IpSelectModal.module.scss";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/shared/Table";
import Button from "@/components/shared/Button";
import { useGetRoomQuery } from "@/features/Rooms/hooks/useRoom";
import { useGetRackQuery } from "@/features/Racks/hooks/useRack";
import { useGetSubnetsQuery } from "@/features/subnet/hooks/useSubnet";
import { DataCenter } from "@/components/data/datacenter";
import { Room } from "@/components/data/room";
import { Rack } from "@/components/data/rack";
import Separator from "@/components/shared/Separator";
import { XIcon } from "lucide-react";

interface IpSelectModalProps {
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

const IpSelectModal: React.FC<IpSelectModalProps> = ({
    isOpen,
    onClose,
    currentDataCenter,
    // onSave,
}) => {
    const units = ["1", "2", "3", "4"];
    // const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
    const { data:subnetdata, isLoading, isError } = useGetSubnetsQuery();
    const [selectedSubnetId, setSelectedSubnetId] = useState<number | null>(null);

    const handleCloseModal = () => {
        // setSelectedCells(new Set());
        if(subnetdata)
        console.log("Subnet Data:", subnetdata);
        onClose();
    };



    const renderbysubnet = (subnetdata: any) => {
        return (
                        <TableBody>
                                <TableRow key={subnetdata.id}>
                                    <TableCell className={styles.unitHeader}>
                                        <span className={styles.unitTitle}>{subnetdata.id}</span>
                                    </TableCell>
                                    <TableCell className={styles.unitCell}>{subnetdata.createdAt} </TableCell>
                                    <TableCell className={styles.unitCell}>{subnetdata.cidr} </TableCell>
                                </TableRow>
                        </TableBody>
        );
    };


    if (!isOpen || !currentDataCenter) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.clearButton} onClick={handleCloseModal}>
                    <XIcon className="w-5 h-[22px] text-gray-500" />
                </button>

                <div className={styles.titleArea}>
                    <div className={styles.titleWrapper}>
                        <Separator className={styles.leftSeparator} />
                        <h2 className={styles.modalTitle}>選擇服務</h2>
                        <Separator className={styles.rightSeparator} />
                    </div>
                </div>

                <div className={styles.tableContainer}>

                    <Table key={`rack-management-table-${currentDataCenter.id}`}>
                        <TableHeader>
                            <TableRow>
                                <TableHead className={styles.dcHeader}>
                                    <span className={styles.dcTitle}>Service</span>
                                </TableHead>
                                <TableHead className={styles.dcHeader}>
                                    <span className={styles.dcTitle}>Datacenter</span>
                                </TableHead>
                                <TableHead className={styles.dcHeader}>
                                    <span className={styles.dcTitle}>CIDR</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {subnetdata?.map((subnet) => (
                                <TableRow key={subnet.id}>
                                <TableCell className={styles.unitHeader}>
                                    <input
                                    type="checkbox"
                                    name="subnetSelection"
                                    value={subnet.id}
                                    checked={selectedSubnetId === subnet.id}
                                    onChange={() => setSelectedSubnetId(subnet.id)}
                                    className={styles.checkboxcell}
                                    />
                                    Service {subnet.id}
                                </TableCell>
                                <TableCell className={styles.unitCell}>{subnet.createdAt}</TableCell>
                                <TableCell className={styles.unitCell}>{subnet.cidr}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>


                    </Table>
                </div>

                <div className={styles.modalActions}>
                    <Button className={styles.saveButton}onClick={handleCloseModal} >確認選擇</Button>
                </div>
            </div>
        </div>
    );
};

export default IpSelectModal;