import React, { useEffect, useState } from "react";
import styles from "./ServiceModal.module.scss";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input/Input";
import Separator from "@/components/shared/Separator";
import { XIcon } from "lucide-react";
import {  useGetSubnetByIdQuery } from "@/features/subnet/hooks/useSubnet";
import { useGetIPPoolByIdQuery, useExtendIPPoolMutation } from "@/features/ipPool/hooks/useIPPool"
import { useCreateServiceMutation} from "@/features/service/hooks/useService"

import { Service } from "@/features/service/types";


interface CreateServiceModalProps  {
  isOpen: boolean;
  onClose: () => void;
  currentService: Service;
}



const ServiceModal_extend: React.FC<CreateServiceModalProps> = ({
  isOpen,
  onClose,
  currentService,
}) => {
  const isEditMode = !!currentService;

  console.log("currentService", currentService);
  const [form, setForm] = useState<{ id: number; cidr: string }>({
    id: -1,
    cidr: "",
  });
  
  console.log("currentService", currentService);
  const currentIPPool = useGetIPPoolByIdQuery(
   currentService.poolId.toString() 
  );
  const selectedDCSubnet = useGetSubnetByIdQuery(currentService.DC.subnetId);

  const createMutation = useCreateServiceMutation();
  const extendMutation = useExtendIPPoolMutation();
  //const { data: subnets, isLoading: isLoadingSubnets } = useGetSubnetsQuery();
  
  console.log("currentIPPool", currentService.cidr);
  //console.log("selectedDCSubnet", selectedDCSubnet.data.cidr);
    
  // initialization
  useEffect(() => {
    if (currentService) {
      setForm({
          id: currentService.poolId,
          cidr: currentService.cidr,
      });
    } else {
      setForm({
        id: -1,
        cidr: "",
      });
    }
  }, [currentService, isOpen, currentIPPool.data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setForm((prev) => ({
      ...prev,
      [name]: value, 
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log("form", form)
      if (isEditMode && currentService) {
        await extendMutation.mutateAsync({
          id: currentService.poolId,
          cidr: form.cidr,
        });
      }
        alert("extended ！");
      
      onClose();
    } catch (error) {
      if (error.response){
        console.error("儲存失敗", error.response.data);
        alert(`儲存失敗: ${error.response.data.message}`);
      }
      
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
              {"Extend IP-Pool"}
            </h2>
            <Separator className={styles.rightSeparator} />
          </div>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.inputColumn}>
            <label className={styles.inputFont}>輸入 {currentService?.name} 的新 IP-Pool</label>
            <div>DC cidr: {selectedDCSubnet.data?.cidr ?? '載入中...'}</div>
            <Input
              type="text"
              name="cidr" 
              placeholder="請輸入IP Pool"
              className={styles.inputField}
              value={form.cidr}
              onChange={handleChange}
            />

          </div>
        </div>

        <div className={styles.modalActions}>
          <Button
            className={styles.saveButton}
            onClick={handleSubmit}
            disabled={createMutation.isLoading || extendMutation.isLoading}
          >
            {(createMutation.isLoading || extendMutation.isLoading)
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

export {ServiceModal_extend};
