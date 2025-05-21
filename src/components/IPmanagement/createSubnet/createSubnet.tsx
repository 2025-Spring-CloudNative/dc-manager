import React, { useEffect, useState } from "react";
import styles from "./createSubnet.module.scss";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input/Input";
import Separator from "@/components/shared/Separator";
import { XIcon } from "lucide-react";
import {
  useCreateDataCenterMutation,
  useUpdateDataCenterMutation,
} from "@/features/dataCenter/hooks/useDataCenter";
import { useGetSubnetsQuery } from "@/features/subnet/hooks/useSubnet";


interface DataCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDataCenter?: {
    id: number;
    name: string;
    location: string;
    subnetCidr?: string; // optional for backward compatibility
  } | null;
}

export const CreateSubnet: React.FC<DataCenterModalProps> = ({
  isOpen,
  onClose,
  currentDataCenter,
}) => {
  const isEditMode = !!currentDataCenter;

  const [form, setForm] = useState({
    dataCenter: {
      name: "",
      location: "",
    },
    subnetCidr: "",
  });

  const createMutation = useCreateDataCenterMutation();
  const updateMutation = useUpdateDataCenterMutation();
  const { data: subnets, isLoading: isLoadingSubnets } = useGetSubnetsQuery();
  // initialization
  useEffect(() => {
    if (currentDataCenter) {
      setForm({
        dataCenter: {
          name: currentDataCenter.name,
          location: currentDataCenter.location,
        },
        subnetCidr: currentDataCenter.subnetCidr || "",
      });
    } else {
      setForm({
        dataCenter: {
          name: "",
          location: "",
        },
        subnetCidr: "",
      });
    }
  }, [currentDataCenter, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "name" || name === "location") {
      setForm((prev) => ({
        ...prev,
        dataCenter: {
          ...prev.dataCenter,
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode && currentDataCenter) {
        await updateMutation.mutateAsync({
          id: currentDataCenter.id.toString(),
          data: {
            name: form.dataCenter.name,
            location: form.dataCenter.location,
          },
        });
        alert("資料中心已更新！");
      } else {
        await createMutation.mutateAsync(form);
        alert("資料中心創建成功！");
      }
      onClose();
    } catch (error) {
      console.error("儲存失敗", error);
      alert("儲存失敗，請檢查資料");
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
              {isEditMode ? "編輯資料中心" : "創建Subnet"}
            </h2>
            <Separator className={styles.rightSeparator} />
          </div>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.inputColumn}>
            <label className={styles.inputFont}>Subnet名稱</label>
            <Input
              type="text"
              name="name"
              placeholder="輸入Subnet名稱"
              className={styles.inputField}
              value={form.dataCenter.name}
              onChange={handleChange}
            />

            <label className={styles.inputFont}>DC位置</label>
            <Input
              type="text"
              name="location"
              placeholder="輸入DC位置"
              className={styles.inputField}
              value={form.dataCenter.location}
              onChange={handleChange}
            />

          <label className={styles.inputFont}>DC Subnet CIDR</label>
          <select
            name="subnetCidr"
            className={styles.subnetSelect}
            value={form.subnetCidr}
            onChange={handleChange}
            disabled={isLoadingSubnets}
          >
            <option value="">自動分配</option>
            {subnets?.map((subnet) => (
              <option key={subnet.id} value={subnet.cidr}>
                {subnet.cidr}
              </option>
            ))}
          </select>

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
              ? "確認修改"
              : "確認創建"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// export default CreateSubnet;
