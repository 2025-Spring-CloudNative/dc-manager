// ManagementPage.tsx
import { XIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/shared/Input/Input";
import Button from "@/components/shared/Button";
import FilterButton from "@/components/DataCenterPage/FilterButton/FilterButton";
import styles from "./ServiceManPage.module.scss";
import searchicon from "@/assets/search.png";
import Card from "@/components/ServiceManPage/Card";
import ServiceTable from "@/components/ServiceManPage/ServiceTable";
import ServiceRackTable from "@/components/ServiceManPage/RackInService";
import { useGetDataCentersQuery } from "@features/dataCenter/hooks/useDataCenter";
import { DataCenter } from "@/components/data/datacenter"; // Import DataCenter interface with correct path
import ServiceModal from "@/components/ServiceManPage/ServiceModal";

const service_man = () => {
    const [inputValue, setInputValue] = useState("");
    const [selectedService, setSelectedService] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRackInfo, setShowRackInfo] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);



    const closeModal = () => setIsModalOpen(false);

    const handleEdit = (service) => {
        setSelectedService(service);  
        setIsModalOpen(true); 
    };        

    const handleCreate = () => {
        setSelectedService(null); 
        setIsModalOpen(true);     
      };
    
    const handleViewRack = (service) => {
        setSelectedService(service);
        setShowRackInfo(true);
    };


    return (
        <>
            <ServiceModal isOpen = {isModalOpen} onClose={closeModal} currentService={selectedService}
            />
            <div className={styles.pageContainer}>
                    <div className={styles.heroSection}>
                        {/* <NvBar /> */}
                    </div>
                    <div className={styles.innerContainer}>
                        {/* Search Bar */}
                        <div className={styles.searchBarContainer}>
                            <div className={styles.searchBarInner}>
                                <div className={styles.searchIcon}>
                                    <img src={searchicon} alt="Search icon" />
                                </div>
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="搜尋機櫃..."
                                />
                                <button className={styles.clearButton} onClick={() => setInputValue("")}>
                                    <XIcon className="w-5 h-[22px] text-gray-500" />
                                </button>
                            </div>
                        </div>
                        <Card className={styles.cardContainer}>
                            <div className={styles.headerRow}>
                                <div className={styles.title_text}>Service Management</div>
                                <Button onClick={handleCreate} className={styles.createServiceButton} >
                                    創建服務
                                </Button>
                                
                            </div>
                            <div className={styles.tableWrapper}>
                                <ServiceTable 
                                    onEdit={handleEdit}
                                    onViewRack={handleViewRack}
                                />
                            </div>
                        </Card>

                        {showRackInfo && selectedService && (
                            <Card className={styles.cardContainer}>
                                <div className={styles.headerRow}>
                                    <div className={styles.title_text}>{selectedService.name}</div>
                                </div>
                                <div className={styles.tableWrapper}>
                                    <ServiceRackTable/>
                                </div>
                            </Card>
                        )}
                        
                    </div>
                </div>
            </>
        
    );
};

export default service_man;