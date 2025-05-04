import { useState } from "react"
import Button from "@/components/shared/Button"
import Card from "@/components/ManagementPage/Card"
import Separator from "@/components/shared/Separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/shared/Table"

import styles from "./FavoriteRackMap.module.scss"

const DataCenterComponentSection = () => {
    const leftDataCenters = [
        {
            id: "DC-B-Left",
            rooms: [
                { name: "Room A", racks: ["Rack 1", "Rack 1", "Rack 1"] },
                { name: "Room B", racks: ["Rack 1"] },
            ],
        },
    ]

    const rightDataCenters = [
        {
            id: "DC-B-Right",
            rooms: [
                { name: "Room C", racks: ["Rack 2", "Rack 2"] },
                { name: "Room D", racks: ["Rack 3"] },
            ],
        },
    ]

    const units = ["Unit", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

    // 左右表格分開管理 clickedCells
    const [clickedCellsLeft, setClickedCellsLeft] = useState<Set<string>>(new Set())
    const [clickedCellsRight, setClickedCellsRight] = useState<Set<string>>(new Set())

    const handleCellClick = (side: "left" | "right", cellKey: string) => {
        if (side === "left") {
            setClickedCellsLeft((prev) => {
                const newSet = new Set(prev)
                if (newSet.has(cellKey)) {
                    newSet.delete(cellKey)
                } else {
                    newSet.add(cellKey)
                }
                return newSet
            })
        } else {
            setClickedCellsRight((prev) => {
                const newSet = new Set(prev)
                if (newSet.has(cellKey)) {
                    newSet.delete(cellKey)
                } else {
                    newSet.add(cellKey)
                }
                return newSet
            })
        }
    }

    return (
        <Card className={styles.componentCard}>
            <div className={styles.headerButtonArea}>
                <Button className={styles.editCabinetButton}>編輯機櫃</Button>
            </div>

            <div className={styles.titleArea}>
                <div className={styles.titleWrapper}>
                    <Separator className={styles.leftSeparator} />
                    <h2 className={styles.title}>常用機櫃</h2>
                    <Separator className={styles.rightSeparator} />
                </div>
            </div>

            <div className={styles.tablesWrapper}>
                {/* 左邊的 Table */}
                {leftDataCenters.map((center, centerIndex) => (
                    <div key={`left-table-${centerIndex}`} className={styles.tableContainer}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        colSpan={
                                            1 +
                                            center.rooms.reduce(
                                                (sum, room) => sum + room.racks.length,
                                                0
                                            )
                                        }
                                        className={styles.dcHeader}
                                    >
                                        <span className={styles.dcTitle}>{center.id}</span>
                                    </TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead className={styles.unitHeader}></TableHead>
                                    {center.rooms.map((room, roomIndex) => (
                                        <TableHead
                                            key={roomIndex}
                                            colSpan={room.racks.length}
                                            className={styles.roomHeader}
                                        >
                                            <span className={styles.roomTitle}>{room.name}</span>
                                        </TableHead>
                                    ))}
                                </TableRow>
                                <TableRow>
                                    <TableHead className={styles.unitHeader}>
                                        <span className={styles.unitTitle}>Unit</span>
                                    </TableHead>
                                    {center.rooms.flatMap((room) =>
                                        room.racks.map((rack, rackIndex) => (
                                            <TableHead
                                                key={`${room.name}-${rackIndex}`}
                                                className={styles.rackHeader}
                                            >
                                                <span className={styles.rackTitle}>{rack}</span>
                                            </TableHead>
                                        ))
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {units.slice(1).map((unit) => (
                                    <TableRow key={unit}>
                                        <TableCell className={styles.unitHeader}>
                                            <span className={styles.unitTitle}>{unit}</span>
                                        </TableCell>
                                        {center.rooms.flatMap((room) =>
                                            room.racks.map((_, rackIndex) => {
                                                const cellKey = `${center.id}-${unit}-${room.name}-${rackIndex}`
                                                const isClicked = clickedCellsLeft.has(cellKey)
                                                return (
                                                    <TableCell
                                                        key={cellKey}
                                                        onClick={() =>
                                                            handleCellClick("left", cellKey)
                                                        }
                                                        className={`${styles.unitCell} ${
                                                            isClicked ? styles.clickedCell : ""
                                                        }`}
                                                    />
                                                )
                                            })
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ))}

                {/* 右邊的 Table */}
                {rightDataCenters.map((center, centerIndex) => (
                    <div key={`right-table-${centerIndex}`} className={styles.tableContainer}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        colSpan={
                                            1 +
                                            center.rooms.reduce(
                                                (sum, room) => sum + room.racks.length,
                                                0
                                            )
                                        }
                                        className={styles.dcHeader}
                                    >
                                        <span className={styles.dcTitle}>{center.id}</span>
                                    </TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead className={styles.unitHeader}></TableHead>
                                    {center.rooms.map((room, roomIndex) => (
                                        <TableHead
                                            key={roomIndex}
                                            colSpan={room.racks.length}
                                            className={styles.roomHeader}
                                        >
                                            <span className={styles.roomTitle}>{room.name}</span>
                                        </TableHead>
                                    ))}
                                </TableRow>
                                <TableRow>
                                    <TableHead className={styles.unitHeader}>
                                        <span className={styles.unitTitle}>Unit</span>
                                    </TableHead>
                                    {center.rooms.flatMap((room) =>
                                        room.racks.map((rack, rackIndex) => (
                                            <TableHead
                                                key={`${room.name}-${rackIndex}`}
                                                className={styles.rackHeader}
                                            >
                                                <span className={styles.rackTitle}>{rack}</span>
                                            </TableHead>
                                        ))
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {units.slice(1).map((unit) => (
                                    <TableRow key={unit}>
                                        <TableCell className={styles.unitHeader}>
                                            <span className={styles.unitTitle}>{unit}</span>
                                        </TableCell>
                                        {center.rooms.flatMap((room) =>
                                            room.racks.map((_, rackIndex) => {
                                                const cellKey = `${center.id}-${unit}-${room.name}-${rackIndex}`
                                                const isClicked = clickedCellsRight.has(cellKey)
                                                return (
                                                    <TableCell
                                                        key={cellKey}
                                                        onClick={() =>
                                                            handleCellClick("right", cellKey)
                                                        }
                                                        className={`${styles.unitCell} ${
                                                            isClicked ? styles.clickedCell : ""
                                                        }`}
                                                    />
                                                )
                                            })
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default DataCenterComponentSection
