import { XIcon } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/shared/Input/Input"
import DataCenterComponentSection from "@/components/ManagementPage/FavoriteRackMap"
import RackSummaryTable from "@/components/ManagementPage/RackSummaryTable"
import FilterButton from "@/components/ManagementPage/FilterButton/FilterButton"
import NvBar from "@/components/shared/nvbar/NvBar" // 這邊注意路徑，對應新位置
import styles from "./ManagementPage.module.scss"
import searchicon from "@/assets/search.png"

import { useDataCenterQuery } from "@features/dataCenter/hooks/useDataCenter"

const ManagementPage = () => {
    const [inputValue, setInputValue] = useState("")
    const { data, isLoading, isError, isSuccess, error } = useDataCenterQuery()

    if (isSuccess) {
        console.log(data)
    }

    return (
        <div className={styles.pageContainer}>
            {/* <NvBar /> */}
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
                        <button
                            className={styles.clearButton}
                            onClick={() => setInputValue("")}
                        >
                            <XIcon className="w-5 h-[22px] text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Filter Controls */}
                <FilterButton />

                {/* Data Center Table */}
                <RackSummaryTable />

                {/* Data Center Component */}
                <DataCenterComponentSection />
            </div>
        </div>
    )
}

export default ManagementPage
