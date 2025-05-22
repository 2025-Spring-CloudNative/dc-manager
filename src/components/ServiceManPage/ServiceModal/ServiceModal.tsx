import React, { useEffect, useState } from "react";
import styles from "./ServiceModal.module.scss";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input/Input";
import Separator from "@/components/shared/Separator";
import { XIcon } from "lucide-react";
import {
  useCreateDataCenterMutation,
  useUpdateDataCenterMutation,
} from "@/features/dataCenter/hooks/useDataCenter";
import { useGetSubnetsQuery } from "@/features/subnet/hooks/useSubnet";
import { useGetDataCentersQuery } from "@/features/dataCenter/hooks/useDataCenter";



interface CreateServiceModalProps  {
  isOpen: boolean;
  onClose: () => void;
  currentService?: {
    id: number;
    name: string;
    dc: string;
    subnetCidr?: string; // optional for backward compatibility
  } | null;
}

const ServiceModal: React.FC<CreateServiceModalProps> = ({
  isOpen,
  onClose,
  currentService,
}) => {
  const isEditMode = !!currentService;

  const [form, setForm] = useState({
    Service: {
      id: -1,
      name: "",
      dc: "",
      subnetCidr: "",
    },
    
  });

  //const createMutation = useCreateDataCenterMutation();
  //const updateMutation = useUpdateDataCenterMutation();
  //const { data: subnets, isLoading: isLoadingSubnets } = useGetSubnetsQuery();
  const { data: dc, isLoading: isLoadingDC } = useGetDataCentersQuery();
    
  // initialization
  useEffect(() => {
    if (currentService) {
      setForm({
        Service: {
          id: currentService.id,
          name: currentService.name,
          dc: currentService.dc,
          subnetCidr: currentService.subnetCidr || "",
        },
        
      });
    } else {
      setForm({
        Service: {
          id: -1,
          name: "",
          dc: "",
          subnetCidr: "",
        },
        
      });
    }
  }, [currentService, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "id" || name === "name" || name === "dc") {
      setForm((prev) => ({
        ...prev,
        Service: {
          ...prev.Service,
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode && currentService) {
        await updateMutation.mutateAsync({
          id: currentService.id.toString(),
          data: {
            name: form.Service.name,
            dc: form.Service.dc,
          },
        });
        alert("服務已更新！");
      } else {
        //await createMutation.mutateAsync(form);
        alert("服務創建成功！");
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
              {isEditMode ? "編輯服務" : "創建服務"}
            </h2>
            <Separator className={styles.rightSeparator} />
          </div>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.inputColumn}>
            <label className={styles.inputFont}>服務名稱</label>
            <Input
              type="text"
              name="name"
              placeholder="輸入服務名稱"
              className={styles.inputField}
              value={form.Service.name}
              onChange={handleChange}
            />


            <label className={styles.inputFont}>選擇綁定資料中心</label>
            <select
              name="dc"
              className={styles.subnetSelect}
              value={form.Service.dc}
              onChange={handleChange}
              disabled={isLoadingDC}
            >
              <option value="">自動分配</option>
              {dc?.map((dc) => (
                <option key={dc.id} value={dc.name}>
                  {dc.name}
                </option>
              ))}
            </select>

            <label className={styles.inputFont}>CIDR</label>
            <Input
                type="text"
                name="location"
                placeholder="輸入CIDR"
                className={styles.inputField}
                value={form.Service.subnetCidr}
                onChange={handleChange}
              />

          </div>
        </div>

        <div className={styles.modalActions}>
          <Button
            className={styles.saveButton}
            //onClick={handleSubmit}
            //disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {/*{(createMutation.isLoading || updateMutation.isLoading)
              ? "儲存中..."
              : isEditMode
              ? "確認修改"
              : "確認創建"}*/}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
