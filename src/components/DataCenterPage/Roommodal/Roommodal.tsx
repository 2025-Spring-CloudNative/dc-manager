import React, { useEffect, useState } from "react";
import styles from "./Roommodal.module.scss";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input/Input";
import Separator from "@/components/shared/Separator";
import { XIcon } from "lucide-react";
import {
  useCreateDataCenterMutation,
  useUpdateDataCenterMutation,
} from "@/features/dataCenter/hooks/useDataCenter";
import { useAddRoomMutation } from "@/features/Rooms/hooks/useRoom";

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDataCenter?: {
    id: number;
    name: string;
    location: string;
    subnetCidr?: string; // optional for backward compatibility
  } | null;
}

const RoomModal: React.FC<RoomModalProps> = ({
  isOpen,
  onClose,
  currentDataCenter,
}) => {
  const isEditMode = !!currentDataCenter;

  const [form, setForm] = useState({
    room: {
      name: "",
      unit: 10,
    }
  });

  const createMutation = useAddRoomMutation();
  const updateMutation = useUpdateDataCenterMutation();

  // initialization
  useEffect(() => {
    setForm({
      room: {
        name: "",
        unit: 9,
      }
    });
  }, [currentDataCenter, isOpen]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      room: {
        ...prev.room,
        [name]: name === "unit"
          ? value === "" ? "" : Number(value)
          : value
      },
    }));
  };

  const handleSubmit = async () => {
    if (!currentDataCenter) return alert("請先選擇資料中心");

    try {
      await createMutation.mutateAsync({
        name: form.room.name,
        unit: form.room.unit,
        dataCenterId: currentDataCenter.id,
      });
      alert("房間創建成功！");
      onClose();
    } catch (error) {
      console.error("創建失敗", error);
      alert("創建失敗，請檢查資料");
    }
  };

  const handleCloseModal = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.clearButton} onClick={handleCloseModal}>
          <XIcon className="w-5 h-[22px] text-gray-500" />
        </button>

        <div className={styles.titleArea}>
          <div className={styles.titleWrapper}>
            <Separator className={styles.leftSeparator} />
            <h2 className={styles.modalTitle}>
              新增資料庫房間
              {/* {isEditMode ? "編輯資料庫房間" : "創建資料中心"} */}
            </h2>
            <Separator className={styles.rightSeparator} />
          </div>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.inputColumn}>
            <label className={styles.inputFont}>房間名稱</label>
            <Input
              type="text"
              name="name"
              placeholder="輸入房間名稱"
              className={styles.inputField}
              value={form.room.name}
              onChange={handleChange}
            />

            <label className={styles.inputFont}>房間高度</label>
            <Input
              type="number"
              name="unit"
              placeholder="輸入DC高度"
              className={styles.inputField}
              value={form.room.unit.toString()}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.modalActions}>
          <Button
            className={styles.saveButton}
            onClick={handleSubmit}
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {(createMutation.isLoading || updateMutation.isLoading)
              ? "儲存中..."
              : isEditMode
                ? "確認"
                : "確認創建"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;
