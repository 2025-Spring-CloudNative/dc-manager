import React, { useEffect, useState } from "react";
import styles from "./MachineModal.module.scss";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input/Input";
import Separator from "@/components/shared/Separator";
import { XIcon } from "lucide-react";
import { Machine } from "@/features/Machine/types";
import { Rack } from "@/features/Racks/types";
import {
    useCreateMachineMutation,
    useUpdateMachineMutation,
    useDeleteMachineMutation,
} from "@/features/Machine/hooks/useMachine";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/shared/Table";
import { cn } from "@/lib/utils";

interface ManageMachineModalProps {
    isOpen: boolean;
    onClose: () => void;
    rack: Rack;
    machines: Machine[];
}

const ManageMachineModal: React.FC<ManageMachineModalProps> = ({
    isOpen,
    onClose,
    rack,
    machines,
}) => {
    const [form, setForm] = useState<Machine>({
        name: "",
        startUnit: 1,
        unit: 1,
        macAddress: "",
        rackId: rack.id as number,
        status: "active",
    });
    const [editingId, setEditingId] = useState<number | null>(null);

    const createMutation = useCreateMachineMutation();
    const updateMutation = useUpdateMachineMutation();
    const deleteMutation = useDeleteMachineMutation();
    console.log("rack height", rack.height);
    console.log("machines = ", machines)
    useEffect(() => {
        if (isOpen) {
            setForm({
                name: "",
                startUnit: 1,
                unit: 1,
                macAddress: "",
                rackId: rack.id as number,
                status: "active",
            });
            setEditingId(null);
        }
    }, [isOpen, rack.id]);
    const getMachineInCell = (unit: number): Machine | undefined => {
        return machines.find((m) => unit >= m.startUnit && unit <= m.startUnit + m.unit - 1);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "startUnit" || name === "unit" ? Number(value) : value,
        }));
    };

    const handleSubmit = async () => {
        if (!form.name || !form.macAddress) return alert("請完整填寫");

        const payload = { ...form, rackId: rack.id };

        try {
            if (editingId) {
                await updateMutation.mutateAsync({ ...payload, id: editingId });
            } else {
                await createMutation.mutateAsync(payload);
            }
            setForm({ name: "", startUnit: 1, unit: 1, macAddress: "", rackId: rack.id, status: "active" });
            setEditingId(null);
        } catch (e) {
            console.error(e);
            alert("儲存失敗");
        }
    };

    const handleEdit = (machine: Machine) => {
        setForm(machine);
        setEditingId(machine.id ?? null);
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        if (!confirm("確認刪除這台機器？")) return;
        try {
            await deleteMutation.mutateAsync(id);
        } catch (e) {
            console.error(e);
            alert("刪除失敗");
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.clearButton} onClick={onClose}>
                    <XIcon className="w-5 h-[22px] text-gray-500" />
                </button>

                <div className={styles.titleArea}>
                    <div className={styles.titleWrapper}>
                        <Separator className={styles.leftSeparator} />
                        <h2 className={styles.modalTitle}>管理機器</h2>
                        <Separator className={styles.rightSeparator} />
                    </div>
                </div>
                <div className={styles.tableWithInputsWrapper}>
                    <div className={styles.inputColumn}>
                        <label>名稱</label>
                        <Input name="name" value={form.name} onChange={handleChange} className={styles.inputField} />

                        <label>起始 Unit</label>
                        <Input name="startUnit" type="number" value={form.startUnit} onChange={handleChange} className={styles.inputField} />

                        <label>佔用 Unit 數</label>
                        <Input name="unit" type="number" value={form.unit} onChange={handleChange} className={styles.inputField} />

                        <label>MAC Address</label>
                        <Input name="macAddress" value={form.macAddress} onChange={handleChange} className={styles.inputField} />
                    </div>


                    <Table className={styles.machineTable}>
                        <TableHeader >
                            <TableRow>
                                <TableHead colSpan={2} className={styles.rackHeader}>{rack.name}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: rack.height }, (_, i) => {
                                const unit = i + 1; // 讓 U 編號從 top (e.g., 20) 到 bottom (1)

                                // 該 unit 是否是某台機器的 startUnit
                                const machineStartUnit = machines.find((m) => m.startUnit === unit);
                                const machineInCell = getMachineInCell(unit);

                                return (
                                    <TableRow key={unit}>
                                        {/* 左邊的 Unit Label */}
                                        <TableCell className={styles.unitHeader}>
                                            <span className={styles.unitTitle}>{unit}</span>
                                        </TableCell>

                                        {/* 機器名稱（只在起始單位顯示） */}
                                        <TableCell className={machineInCell ? styles.hasMachine : styles.unitCell}>
                                            {machineStartUnit ? machineStartUnit.name : ""}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>

                    </Table>
                </div>

                <div className={styles.modalActions}>
                    <Button className={styles.saveButton} onClick={handleSubmit}>
                        {editingId ? "更新" : "新增"}
                    </Button>
                </div>
            </div>
        </div >
    );
};

export default ManageMachineModal;
