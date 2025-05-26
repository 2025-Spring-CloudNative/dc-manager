// DataCenterPage.tsx
import { useState, useCallback } from "react"
import PinnedDataCenters from "@/components/DataCenterPage/PinnedDataCenters"
import RackSummaryTable from "@/components/DataCenterPage/RackSummaryTable"
import styles from "./DataCenterPage.module.scss"

import type { DataCenterFilters } from "@features/dataCenter/apis/dataCenterApi"
import { useGetDataCentersQuery } from "@features/dataCenter/hooks/useDataCenter"
import { DataCenter } from "@/features/dataCenter/types" // Import DataCenter interface with correct path

import SearchBar, {
    SearchParams,
} from "@components/DataCenterPage/SearchBar/SearchBar"

const DataCenterPage = () => {
    // const { data, isSuccess } = useGetDataCentersQuery()
    const [filters, setFilters] = useState<DataCenterFilters>({})
    const {
        data: dataCenters,
        isSuccess,
        isLoading,
        isError,
    } = useGetDataCentersQuery(filters)

    const [selectedLeftDC, setSelectedLeftDC] = useState<DataCenter | null>(
        null
    )
    const [selectedRightDC, setSelectedRightDC] = useState<DataCenter | null>(
        null
    )

    const handleSearch = useCallback((p: SearchParams) => {
        const next: DataCenterFilters = {
            sortBy: p.sortBy || undefined,
            sortOrder: p.sortOrder,
        }

        if (p.query && p.searchBy) {
            next[p.searchBy] = p.query // dynamic: name or location
        }
        setFilters(next)
    }, [])

    const handleAddToLeft = (dataCenter: DataCenter) => {
        setSelectedLeftDC(dataCenter)
    }

    const handleAddToRight = (dataCenter: DataCenter) => {
        setSelectedRightDC(dataCenter)
    }

    if (isSuccess && dataCenters) {
        console.log(dataCenters)
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.heroSection}>{/* <NvBar /> */}</div>

            <div className={styles.innerContainer}>
                {/* Search Bar */}
                <SearchBar onSearch={handleSearch} />
                {isLoading && <p>Loading…</p>}
                {isError && <p>Failed to load data centers.</p>}

                {/* Data Center Table */}
                <RackSummaryTable
                    dataCenters={dataCenters}
                    onAddToLeft={handleAddToLeft}
                    onAddToRight={handleAddToRight}
                />

                {/* Combined Favorite Tables */}
                <div className={styles.favoriteTablesContainer}>
                    <PinnedDataCenters
                        dataCenters={{
                            left: selectedLeftDC ? [selectedLeftDC] : [],
                            right: selectedRightDC ? [selectedRightDC] : [],
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default DataCenterPage
