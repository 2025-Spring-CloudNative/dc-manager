import styles from "./ServiceTable.module.scss"
import { TableServiceRow } from "@/features/service/types"
import { useGetServiceFaultRateByIdQuery } from "@features/service/hooks/useService"

export default function ServiceRow({
    service,
    onDelete,
    onEdit,
    onViewRack,
    onExtendIPPool,
}: {
    service: TableServiceRow
    onDelete: () => void
    onEdit: (service: TableServiceRow) => void
    onViewRack: (service: TableServiceRow) => void
    onExtendIPPool: () => void
}) {
    const { data: serviceFaultRate, isSuccess } =
        useGetServiceFaultRateByIdQuery(service.id!)

    return (
        <div className={styles.row}>
            {/* <div className={`${styles.squareBox} ${
                            service?.utilization === 0.1
                                ? styles.red
                                : service?.utilization > 0.1
                                ? styles.yellow
                                : styles.green
                        }`}></div> */}
            {isSuccess ? (
                <div
                    className={`${styles.squareBox} ${
                        // rackUtilization?.utilization === 0.1
                        //     ? styles.red
                        //     : rackUtilization?.utilization > 0.1
                        //     ? styles.yellow
                        //     : styles.green
                        serviceFaultRate!.faultRate > 0.1
                            ? styles.red
                            : serviceFaultRate!.faultRate > 0.05
                            ? styles.yellow
                            : styles.green
                    }`}
                ></div>
            ) : null}
            <div className={styles.tableRowText} style={{ width: "135px" }}>
                {service.name}
            </div>
            <div className={styles.sepLine}></div>
            <div className={styles.tableRowText} style={{ width: "135px" }}>
                {service.datacenter}
            </div>
            <div className={styles.sepLine}></div>
            <div className={styles.tableRowText} style={{ width: "145px" }}>
                {service.cidr}
            </div>
            <div className={styles.sepLine}></div>
            <div className={styles.utilBar}>
                <div
                    style={{ width: `${service.utilization * 150}px` }}
                    className={`${styles.utilFill} ${
                        service.utilization >= 0.8 ? styles.utilHigh : ""
                    }`}
                />
                <span>{(service.utilization * 100).toFixed(2)}%</span>
            </div>
            <button onClick={onExtendIPPool} className={styles.extendIPPool}>
                Extend IP Pool
            </button>
            <button
                onClick={() => onViewRack(service)}
                className={styles.viewRackBtn}
            >
                查看Rack
            </button>
            <button onClick={() => onEdit(service)} className={styles.editBtn}>
                編輯
            </button>
            <button onClick={onDelete} className={styles.deleteBtn}>
                刪除
            </button>
        </div>
    )
}
