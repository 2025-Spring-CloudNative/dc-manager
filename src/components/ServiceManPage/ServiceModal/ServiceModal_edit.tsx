import React, { useEffect, useState } from "react";
import styles from "./ServiceModal.module.scss";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input/Input";
import Separator from "@/components/shared/Separator";
import { XIcon } from "lucide-react";
import { useCreateServiceMutation, useUpdateServiceMutation} from "@/features/service/hooks/useService"
import { Service } from "@/features/service/types";


interface CreateServiceModalProps  {
  isOpen: boolean;
  onClose: () => void;
  currentService?: Service | null;
}



const ServiceModal_edit: React.FC<CreateServiceModalProps> = ({
  isOpen,
  onClose,
  currentService,
}) => {
  const isEditMode = !!currentService;

  //console.log("currentService", currentService);
  const [form, setForm] = useState<Service>({
     id: -1,
     name: "", 
     poolId: -1 ,
  });

  const createMutation = useCreateServiceMutation();
  const updateMutation = useUpdateServiceMutation();
  //const { data: subnets, isLoading: isLoadingSubnets } = useGetSubnetsQuery();
  // const { data: dc, isLoading: isLoadingDC } = useGetDataCentersQuery();
  // const currentServiceDC =currentService?.DC
  //console.log("currentServiceDC", currentServiceDC);
    
  // initialization
  useEffect(() => {
    if (currentService) {
      setForm({
          id: currentService.id,
          name: currentService.name,
          poolId: currentService.poolId,
      });
    } else {
      setForm({
        name: "",
        poolId: -1,
      });
    }
  }, [currentService, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setForm((prev) => ({
      ...prev,
      [name]: name === "poolId" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log("form", form)
      if (isEditMode && currentService) {
        await updateMutation.mutateAsync({
          id: currentService.id,
          name: form.name,
          poolId: form.poolId,
        });
      }
        alert("服務已更新！");
      
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
              value={form.name}
              onChange={handleChange}
            />


            

            <label className={styles.inputFont}>IPPool ID</label>
            <Input
                type="text"
                name="poolId"   
                placeholder="輸入IPPool ID"
                className={styles.inputField}
                value={form.poolId!.toString()}
                onChange={handleChange}
              />

          </div>
        </div>

        <div className={styles.modalActions}>
          <Button
            className={styles.saveButton}
            onClick={handleSubmit}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {(createMutation.isPending || updateMutation.isPending)
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

export {ServiceModal_edit};
