import {  useRef } from "react"
import styles from "./ServiceTable.module.scss"
import ServiceHeader from "./ServiceHeader"
import ServiceRow from "./ServiceRow"
import {
    useGetServicesQuery,
    useDeleteServiceMutation,
} from "@/features/service/hooks/useService"
import {
    useGetDataCentersQuery,
} from "@/features/dataCenter/hooks/useDataCenter"

import {
    useIPPoolsWithUtilizations,
} from "@/features/ipPool/hooks/useIPPool"
import { useGetSubnetsQuery } from "@/features/subnet/hooks/useSubnet"
import { Service , TableServiceRow} from "@/features/service/types"
import { IPPoolWithUtilization } from "@/features/ipPool/types"
import { DataCenter } from "@/features/dataCenter/types"
import { Subnet } from "@/features/subnet/types"


function generateTableData(
    services: Service[],
    ipPools: IPPoolWithUtilization[],
    subnets: Subnet[],
    dataCenters: DataCenter[]
): TableServiceRow[] {
    const tableRows = services.map((service) => {
        console.log("service", service)
        console.log("subnet", subnets)
        console.log("dataCenters", dataCenters)

        const ipPool = ipPools.find((p) => p.id === service.poolId)
        const subnet = ipPool
            ? subnets.find((s) => s.id === ipPool.subnetId)
            : undefined
        //console.log('subnet!', subnet.id)
        console.log('ipPool!', ipPool)
        const dataCenter = subnet
            ? dataCenters.find((d) => d.subnetId === subnet.id)
            : undefined
        const utilization = ipPool?.utilization.utilization ?? 0

        return {
            id: service.id!,
            poolId: service.poolId!,
            name: service.name,
            cidr: ipPool?.cidr || "N/A",
            utilization: utilization || 0,
            datacenter: dataCenter?.name || "N/A",
            DC: dataCenter,
        }
    })

    return tableRows
}
/*
type TableServiceRow = {
    id: number
    poolId: number
    name: string
    cidr: string
    utilization?: number
    datacenter?: string
    DC?: DataCenter
}*/

export default function ServiceTable({
    onEdit,
    onViewRack,
    onExtendIPPoolClick,
 }:{
onViewRack: (service: TableServiceRow) => void;
  onEdit: (service: TableServiceRow) => void;
  onExtendIPPoolClick: (service: TableServiceRow) => void;
})
{
    //const [services, setServices] = useState(initialServices);
    ///const [tableData, setTableData] = useState<TableServiceRow[]>([]);
    const servicesRef = useRef<TableServiceRow[]>([])

    //const [deleteTrigger, setDeleteTrigger] = useState(0)
    //const [refreshFlag, setRefreshFlag] = useState(0)
    const {
        data: serviceData,
        isLoading: isLoadingServices,
        // isError: isErrorServices,
        //refetch: refetchServices,
    } = useGetServicesQuery()
    //const { data: rackData, isLoading: isLoadingRack, isError: isErrorRack } = useGetRackQuery();
    const {
        data: dcData,
        isLoading: isLoadingDC,
        // isError: isErrorDC,
    } = useGetDataCentersQuery()
    const {
        data: ipPoolData,
        isLoading: isLoadingipPool,
        // isError: isErroripPool,
        //refetch: refetchIPPool,
    } = useIPPoolsWithUtilizations()
    const {
        data: subnetData,
        isLoading: isLoadingSubnet,
        // isError: isErrorSubnet,
        //refetch: refetchSubnet,
    } = useGetSubnetsQuery()
    // const { mutate: extendIPPool } = useExtendIPPoolMutation()
    const { mutate: deleteService } = useDeleteServiceMutation()
    //const { data: pools, isLoading: isLoadingipPoollll, isError: isErroripPoollll } = useIPPoolsWithUtilizations();



    /*useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false
            return
        }

        if (!dcData) {
            console.log("DC 資料尚未載入，跳過 refetch")
            return
        }

        // 先用 Promise.all 串起 refetchIPPool() 和 refetchSubnet()，等待完成後再執行 refetchServices
        Promise.all([refetchIPPool(), refetchSubnet()])
            .then(() => {
                if (!ipPoolData || !subnetData) {
                    console.log("IP Pool 或 Subnet 資料尚未完整，跳過 refetch")
                    return
                }

                console.log("🔁 refetchTrigger changed, will refetch services")
                return refetchServices()
            })
            .then((result) => {
                if (result?.data && ipPoolData && subnetData && dcData) {
                    servicesRef.current = generateTableData(
                        result.data,
                        ipPoolData,
                        subnetData,
                        dcData
                    )

                    console.log(
                        "✅ Regenerated servicesRef:",
                        servicesRef.current
                    )
                    //setRefreshFlag((f) => f + 1)
                } else {
                    console.warn("缺少資料，無法生成 tableData", {
                        resultData: result?.data,
                        ipPoolData,
                        subnetData,
                        dcData,
                    })
                }
            })
            .catch((err) => {
                console.error("Refetch 發生錯誤:", err)
            })
    }, [refetchTrigger])
    */

    //console.log("ipPoolData", ipPoolData);

    if (
        isLoadingServices ||
        isLoadingDC ||
        isLoadingipPool ||
        isLoadingSubnet ||
        !serviceData ||
        !dcData ||
        !ipPoolData ||
        !subnetData
    ) {
        return <div>Loading...</div>
    }

    if (
        !servicesRef.current.length &&
        serviceData &&
        ipPoolData &&
        subnetData &&
        dcData
    ) {
        servicesRef.current = generateTableData(
            serviceData,
            ipPoolData,
            subnetData,
            dcData
        )
    }

    //useEffect(() => {refetchServices();}, [refetchTrigger]);

    //console.log("pools", pools);
    //console.log("ipPoolData", ipPoolData);

    //const utilizationQueries = useMultipleIPPoolsUtilization(ipPoolData);

    //console.log('servicedata:', serviceData);
    //console.log('Rackdata:', rackData);
    //console.log('subnetData:', subnetData);

    //const racksByService = groupRacksByService(rackData, serviceData);
    //console.log("racksByService", racksByService);

    //console.log("ipPoolData", ipPoolData);

    const services = generateTableData(
        serviceData,
        ipPoolData,
        subnetData,
        dcData
    )
    //const services = servicesRef.current;
    console.log("services", services)

    const handleDelete = (id: number) => {
        //setServices(prev => prev.filter(s => s.id !== id));
        if (window.confirm("確定要刪除這個服務？")) {
            deleteService(id)
            //setDeleteTrigger(prev => prev + 1);
        }
    }

    const ExtendIPPool = (service: TableServiceRow) => {
        // setServices(prev => prev.filter(s => s.id !== id));
        console.log("Extending IP Pool for:", service)
        //extendIPPool({ id: service.poolId, cidr: service.cidr });
        onExtendIPPoolClick?.(service)
    }

    return (
        <div className={styles.tableContainer}>
            <ServiceHeader />
            {services.map((service) => (
                <ServiceRow
                    key={service.id}
                    service={service}
                    onDelete={() => handleDelete(service.id)}
                    onExtendIPPool={() => ExtendIPPool(service)}
                    onEdit={onEdit}
                    onViewRack={onViewRack}
                />
            ))}
        </div>
    )
}
