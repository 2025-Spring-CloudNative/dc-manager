import React, { useEffect, useState } from "react"
import styles from "./createSubnet.module.scss"
import Button from "@/components/shared/Button"
import Input from "@/components/shared/Input/Input"
import Separator from "@/components/shared/Separator"
import { XIcon } from "lucide-react"
import { useCreateSubnetMutation, useUpdateSubnetMutation } from "@/features/subnet/hooks/useSubnet"
import { useGetSubnetsQuery } from "@/features/subnet/hooks/useSubnet"
import { Subnet } from "@/features/subnet/types"

interface SubnetModalProps {
    isOpen: boolean
    onClose: () => void
}

export const CreateSubnet: React.FC<SubnetModalProps> = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({
        Subnet: {
            cidr: "",
            netmask: "",
            gateway: "",
        },
    })

    const createMutation = useCreateSubnetMutation()
    const updateMutation = useUpdateSubnetMutation()

    // const { data: subnets, isLoading: isLoadingSubnets } = useGetSubnetsQuery();
    // initialization
    useEffect(() => {
        setForm({
            Subnet: {
                cidr: "",
                netmask: "",
                gateway: "",
            },
        })
    }, [isOpen])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            Subnet: {
                ...prev.Subnet,
                [name]: value,
            },
        }))
    }

    const handleSubmit = async () => {
        try {
            const currentTimestamp = new Date().toISOString()

            const payload = {
                ...form.Subnet,
                created_at: currentTimestamp,
                updated_at: null,
            }

            await createMutation.mutateAsync(payload)
            alert("Subnet創建成功!")
            onClose()
        } catch (error) {
            console.error("儲存失敗", error)
            alert("儲存失敗，請檢查資料")
        }
    }

    const handleCloseModal = () => {
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.clearButton} onClick={handleCloseModal}>
                    <XIcon className="w-5 h-[22px] text-gray-500" />
                </button>

                <div className={styles.titleArea}>
                    <div className={styles.titleWrapper}>
                        <Separator className={styles.leftSeparator} />
                        <h2 className={styles.modalTitle}>{"創建Subnet"}</h2>
                        <Separator className={styles.rightSeparator} />
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    <div className={styles.inputColumn}>
                        <label className={styles.inputFont}>Subnet cidr</label>
                        <Input
                            type="text"
                            name="cidr"
                            placeholder="輸入Subnet位置"
                            className={styles.inputField}
                            value={form.Subnet.cidr}
                            onChange={handleChange}
                        />

                        <label className={styles.inputFont}>Subnet Mask</label>
                        <Input
                            type="text"
                            name="netmask"
                            placeholder="輸入Subnet遮罩"
                            className={styles.inputField}
                            value={form.Subnet.netmask}
                            onChange={handleChange}
                        />

                        <label className={styles.inputFont}>Subnet Gateway</label>
                        <Input
                            type="text"
                            name="gateway"
                            placeholder="輸入Subnet閘門"
                            className={styles.inputField}
                            value={form.Subnet.gateway}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {createMutation.isError && (
                    <p className={styles.error}>
                        {createMutation.error instanceof Error
                            ? createMutation.error.message
                            : "儲存失敗"}
                    </p>
                )}

                <div className={styles.modalActions}>
                    <Button
                        className={styles.saveButton}
                        onClick={handleSubmit}
                        disabled={createMutation.isPending || updateMutation.isPending}
                    >
                        {createMutation.isPending || updateMutation.isPending
                            ? "儲存中..."
                            : "確認創建"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

// export default CreateSubnet;
