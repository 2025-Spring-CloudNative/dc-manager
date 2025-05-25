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
import { useGetSubnetsQuery , getSubnetbyID, useGetSubnetByIdQuery } from "@/features/subnet/hooks/useSubnet";
import { useGetDataCentersQuery } from "@/features/dataCenter/hooks/useDataCenter";
import { useCreateServiceMutation, useUpdateServiceMutation} from "@/features/service/hooks/useService"
import { CreateServiceRequest } from "@/features/service/types";
import { Service } from "@/features/service/types";


interface CreateServiceModalProps  {
  isOpen: boolean;
  onClose: () => void;
  currentService?: Service | null;
  onServiceUpdated?: () => void;
}



const ServiceModal: React.FC<CreateServiceModalProps> = ({
  isOpen,
  onClose,
  currentService,
  onServiceUpdated,
}) => {
  const isEditMode = !!currentService;

  //console.log("currentService", currentService);
  const [form, setForm] = useState<CreateServiceRequest>({
    service: { name: "" },
    dataCenter: { name: "", location: "", subnetId: "" },
    cidrFromUser: "",
  });
  

  const createMutation = useCreateServiceMutation();
  const updateMutation = useUpdateServiceMutation();
  
  //const { data: subnets, isLoading: isLoadingSubnets } = useGetSubnetsQuery();
  const { data: dc, isLoading: isLoadingDC } = useGetDataCentersQuery();
  const currentServiceDC =currentService?.DC
  const selectedDC = dc?.find((item) => item.name === form.dataCenter.name);
  const { data: DcSubnet, isLoading: isLoadingSubnet } = useGetSubnetByIdQuery(
    selectedDC?.subnetId,
  );
 
  //console.log("currentServiceDC", currentServiceDC);
    
  // initialization
  useEffect(() => {
    if (currentService) {
      setForm({
        service: {
          id: currentService.id,
          name: currentService.name,
        },
        dataCenter: {
          name: currentService.datacenter,
          location: currentServiceDC.location,
          subnetId: currentServiceDC.subnetId,
        },
        cidrFromUser: currentService.cidr || "",
      });
    } else {
      setForm({
        service: {
          name: "",
        },
        dataCenter: {
          name: "",
          location: "",
          subnetId: "",
        },
        cidrFromUser:  "",
        
      });
    }
  }, [currentService, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    if (name === "service.name") {
      setForm((prev) => ({
        ...prev,
        service: { ...prev.service, name: value },
      }));
    }  else if (name === 'dataCenter.name') {
      const selectedDC = dc.find((d) => d.name === value);
      setForm((prevForm) => ({
        ...prevForm,
        dataCenter: {
          name: value,
          location: selectedDC?.location ?? '',
          subnetId: selectedDC?.subnetId ?? '',
        },
      }));
    }  else if (name === "cidrFromUser") {
      setForm((prev) => ({
        ...prev,
        cidrFromUser: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("form", form)
      if (isEditMode && currentService) {
        await updateMutation.mutateAsync({
          service: {
            id: currentService.id,
            name: form.service.name,
          },
          dataCenter: {
            name: form.dataCenter.name,
            location: form.dataCenter.location,
            subnetId: form.dataCenter.subnetId,
          },
          cidrFromUser: form.cidrFromUser || "",
        });
        alert("服務已更新！");
      } else {
        await createMutation.mutateAsync(form);
        onServiceUpdated?.();
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
              name="service.name" 
              placeholder="輸入服務名稱"
              className={styles.inputField}
              value={form.service.name}
              onChange={handleChange}
            />


            <label className={styles.inputFont}>選擇綁定資料中心</label>
            <select
              name="dataCenter.name"
              className={styles.subnetSelect}
              value={form.dataCenter.name}
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
            {selectedDC && (
              <div>
                {isLoadingSubnet ? (
                  <p>Loading...</p>
                ) : DcSubnet ? (
                  <p>DC subnet：{DcSubnet.cidr}</p>
                ) : (
                  <p>get dc subnet failed</p>
                )}
              </div>
            )}

            <label className={styles.inputFont}>CIDR</label>
            <Input
                type="text"
                name="cidrFromUser"   
                placeholder="輸入CIDR"
                className={styles.inputField}
                value={form.cidrFromUser}
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
              ? "確認修改"
              : "確認創建"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export {ServiceModal};
