import React, { useState, useEffect } from "react";
import styles from "./ServiceSelectModal.module.scss";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/shared/Table";
import Button from "@/components/shared/Button";
import { useGetServicesQuery } from "@/features/Services/hooks/useService";
import { useUpdateRackMutation } from "@/features/Racks/hooks/useRack";
import { Rack } from "@/features/Racks/types";
import Separator from "@/components/shared/Separator";
import { XIcon } from "lucide-react";

interface IpSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentRack?: Rack | null; // Expecting a single Rack
}


const IpSelectModal: React.FC<IpSelectModalProps> = ({
    isOpen,
    onClose,
    currentRack
    // onSave,
}) => {
    // const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
    const { data: Servicedata, isLoading, isError } = useGetServicesQuery();
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
    const UpdateRack = useUpdateRackMutation();
    useEffect(() => {
        if (isOpen && currentRack?.serviceId) {
            setSelectedServiceId(currentRack.serviceId);
        }
    }, [isOpen, currentRack?.serviceId]);
    const handleCloseModal = () => {
        // setSelectedCells(new Set());
        if (Servicedata)
            console.log("Service Data:", Servicedata);
        onClose();
    };
    const handleSave = () => {
        if (selectedServiceId && currentRack) {
            UpdateRack.mutate({
                id: currentRack.id.toString(),
                data: {
                    name: currentRack.name,
                    height: currentRack.height,
                    tag: currentRack.tag,
                    roomId: currentRack.roomId,
                    serviceId: selectedServiceId,
                },
            });
            onClose();
        }
        onClose();
    }




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

                    <Table key={`rack-management-table-${currentRack.id}`}>
                        <TableHeader>
                            <TableRow>
                                <TableHead className={styles.dcHeader}>
                                    <span className={styles.dcTitle}>選擇</span>
                                </TableHead>
                                <TableHead className={styles.dcHeader}>
                                    <span className={styles.dcTitle}>Service Name</span>
                                </TableHead>
                                <TableHead className={styles.dcHeader}>
                                    <span className={styles.dcTitle}>Pool ID</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={3} className={styles.unitCell}>載入中...</TableCell>
                                </TableRow>
                            ) : isError ? (
                                <TableRow>
                                    <TableCell colSpan={3} className={styles.unitCell}>服務資料載入失敗</TableCell>
                                </TableRow>
                            ) : Servicedata?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className={styles.unitCell}>尚無服務資料</TableCell>
                                </TableRow>
                            ) : (
                                Servicedata.map((service) => (
                                    <TableRow key={service.id}>
                                        <TableCell className={styles.unitHeader}>
                                            <input
                                                type="radio"
                                                name="ServiceSelection"
                                                value={service.id}
                                                checked={selectedServiceId === service.id}
                                                onChange={() => setSelectedServiceId(service.id)}
                                                className={styles.checkboxcell}
                                            />

                                        </TableCell>
                                        <TableCell className={styles.unitCell}>{service.name}</TableCell>
                                        <TableCell className={styles.unitCell}>{service.poolId}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>



                    </Table>
                </div>

                <div className={styles.modalActions}>
                    <Button className={styles.saveButton} onClick={handleSave} >確認選擇</Button>
                </div>
            </div>
        </div>
    );
};

export default IpSelectModal;