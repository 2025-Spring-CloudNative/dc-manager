// ManagementPage.tsx
import { XIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/shared/Input/Input";
import DataCenterComponentSection from "@/components/ManagementPage/FavoriteRackMap";
import RackSummaryTable from "@/components/ManagementPage/RackSummaryTable";
import FilterButton from "@/components/ManagementPage/FilterButton/FilterButton";
import NvBar from "@/components/shared/NvBar";
import styles from "./ManagementPage.module.scss";
import searchicon from "@/assets/search.png";

import { useGetDataCentersQuery } from "@features/dataCenter/hooks/useDataCenter";
import { DataCenter } from "@/components/data/rackData"; // Import DataCenter interface

const ManagementPage = () => {
    const [inputValue, setInputValue] = useState("");
    const { data, isSuccess } = useGetDataCentersQuery();
    const [selectedLeftDC, setSelectedLeftDC] = useState<DataCenter | null>(null);
    const [selectedRightDC, setSelectedRightDC] = useState<DataCenter | null>(null);

    const handleAddToLeft = (dataCenter: DataCenter) => {
        setSelectedLeftDC(dataCenter);
    };

    const handleAddToRight = (dataCenter: DataCenter) => {
        setSelectedRightDC(dataCenter);
    };

    if (isSuccess && data) {
        console.log(data);
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.heroSection}>
                <NvBar />
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

                {/* Filter Controls */}
                <FilterButton />

                {/* Data Center Table */}
                <RackSummaryTable onAddToLeft={handleAddToLeft} onAddToRight={handleAddToRight} />

                {/* Combined Favorite Tables */}
                <div className={styles.favoriteTablesContainer}>
                    <h3>常用的機櫃</h3>
                    <DataCenterComponentSection
                        leftDataCenters={selectedLeftDC ? [selectedLeftDC] : []}
                        rightDataCenters={selectedRightDC ? [selectedRightDC] : []}
                    />
                </div>
            </div>
        </div>
    );
};

export default ManagementPage;