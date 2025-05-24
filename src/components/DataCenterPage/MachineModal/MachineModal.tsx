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

interface MachineModalProps {
    isOpen: boolean;
    onClose: () => void;
    rack: Rack;
    machines: Machine[];
    title: string;
    editmachine?: Machine;
}

const MachineModal: React.FC<MachineModalProps> = ({
    isOpen,
    onClose,
    rack,
    machines,
    title,
    editmachine
}) => {
    const [form, setForm] = useState<Machine>({
        name: "",
        startUnit: 1,
        unit: 1,
        macAddress: "",
        rackId: rack.id as number,
        status: "active",
    });
    // const [editingId, setEditingId] = useState<number | null>(null);
    const [selectedUnits, setSelectedUnits] = useState<Set<number>>(new Set());
    const createMutation = useCreateMachineMutation();
    const updateMutation = useUpdateMachineMutation();

    // 根據 editmachine 是否存在，決定使用哪個 mutation
    const mutation = editmachine ? updateMutation : createMutation;
    useEffect(() => {
        if (selectedUnits.size === 0) return;

        const unitsArray = Array.from(selectedUnits).sort((a, b) => a - b);
        const start = unitsArray[0];
        const count = unitsArray.length;

        setForm((prev) => ({
            ...prev,
            startUnit: start,
            unit: count,
        }));
    }, [selectedUnits]);

    // const deleteMutation = useDeleteMachineMutation();
    useEffect(() => {
        if (isOpen) {
            if (editmachine) {
                setForm(editmachine);
                const selected = new Set<number>();
                for (let i = 0; i < editmachine.unit; i++) {
                    selected.add(editmachine.startUnit + i);
                }
                console.log("Selected units:", selected);
                setSelectedUnits(selected);
            } else {
                setForm({
                    name: "",
                    startUnit: 1,
                    unit: 1,
                    macAddress: "",
                    rackId: rack.id,
                    status: "active",
                });
                setSelectedUnits(new Set());
            }
        }
    }, [isOpen, rack.id, editmachine]);

    const getMachineInCell = (unit: number): Machine | undefined => {
        return machines.find((m) =>
            m.id !== editmachine?.id && // 排除當前要編輯的機器
            unit >= m.startUnit &&
            unit <= m.startUnit + m.unit - 1
        );
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

        const unitsArray = Array.from(selectedUnits).sort((a, b) => a - b);
        const isContiguous = unitsArray.every((u, i, arr) => i === 0 || u === arr[i - 1] + 1);

        if (!isContiguous) {
            return alert("請選擇連續的單元");
        }

        const payload = {
            ...form,
            rackId: rack.id,
            startUnit: unitsArray[0],
            unit: unitsArray.length,
        };

        try {
            // console.log("Submitting payload:", payload);
            if (editmachine) { // No need to check payload.id here, it will be in form if editmachine exists
                // Assert that payload.id is a number when calling updateMutation
                await updateMutation.mutateAsync({ id: payload.id as number, data: payload as Machine });
            } else {
                // This else block handles the create case
                await createMutation.mutateAsync(payload as Machine);
            }
            setForm({ name: "", startUnit: 1, unit: 1, macAddress: "", rackId: rack.id!, status: "active" });
            setSelectedUnits(new Set());
            onClose();
        } catch (e) {
            console.error(e);
            alert("儲存失敗");
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
                        <h2 className={styles.modalTitle}>{title}</h2>
                        <Separator className={styles.rightSeparator} />
                    </div>
                </div>
                <div className={styles.tableWithInputsWrapper}>
                    <div className={styles.inputColumn}>
                        <label>名稱</label>
                        <Input name="name" value={form.name} onChange={handleChange} className={styles.inputField} />

                        <label>起始 Unit</label>
                        <Input name="startUnit" type="number" value={form.startUnit} readOnly className={cn(styles.inputField, styles.readonlyInput)} />

                        <label>佔用 Unit 數</label>
                        <Input name="unit" type="number" value={form.unit} readOnly className={cn(styles.inputField, styles.readonlyInput)} />


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
                                    <TableRow
                                        key={unit}
                                        onClick={() => {
                                            if (!machineInCell) {
                                                setSelectedUnits(prev => {
                                                    const newSet = new Set(prev);
                                                    if (newSet.has(unit)) {
                                                        newSet.delete(unit); // 取消選取
                                                    } else {
                                                        newSet.add(unit); // 新增選取
                                                    }
                                                    return newSet;
                                                });
                                            }
                                        }}
                                        className={cn({
                                            [styles.selectable]: !machineInCell,
                                            [styles.selected]: selectedUnits.has(unit),
                                        })}
                                    >

                                        {/* 左邊的 Unit Label */}
                                        <TableCell className={styles.unitHeader}>
                                            <span className={styles.unitTitle}>{unit}</span>
                                        </TableCell>

                                        {/* 機器名稱（只在起始單位顯示） */}
                                        <TableCell className={cn({
                                            [styles.hasMachine]: machineInCell,
                                            [styles.selectable]: !machineInCell,
                                            [styles.selected]: selectedUnits.has(unit),
                                        })}>
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
                        {editmachine ? "更新" : "新增"}
                    </Button>

                </div>
            </div>
        </div >
    );
};

export default MachineModal;
