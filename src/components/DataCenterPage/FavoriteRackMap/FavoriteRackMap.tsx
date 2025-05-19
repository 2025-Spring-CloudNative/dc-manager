import { XIcon } from "lucide-react";
import { useState, useRef } from "react";
import Button from "@/components/shared/Button";
import Card from "@/components/DataCenterPage/Card";
import Separator from "@/components/shared/Separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/shared/Table";

import styles from "./FavoriteRackMap.module.scss";
import RackManagementModal from "@/components/DataCenterPage/RackManagementModal";
import IpSelectModal from "@/components/DataCenterPage/IpSelectModal";
import CreateDCmodal from "@/components/DataCenterPage/DCmodal";
// import { DataCenter } from "@/components/data/rackData";
import {
    useGetDataCentersQuery,
    useDeleteDataCenterMutation,
} from "@/features/dataCenter/hooks/useDataCenter";
import {
    useGetRoomQuery,
    useAddRoomMutation,
} from "@/features/Rooms/hooks/useRoom";

import {
    useGetRackQuery,
    useAddRackMutation,
    useDeleteRackMutation,
} from "@/features/Racks/hooks/useRack";
import { DataCenter } from "@/components/data/datacenter";
import { Room } from "@/components/data/room";
import { Rack } from "@/components/data/rack";
import CreateModal from "@/components/shared/CreateModal";
import { useDeleteRoomMutation } from "@/features/Rooms/hooks/useRoom";

// import for hover data center
import { cn } from "@/lib/utils";

// enable create room with room modal
interface DataCenterComponentSectionProps {
    dataCenters: {
        left: DataCenter[];
        right: DataCenter[];
    };
}
const RackActionMenu: React.FC<{
    onDelete: () => void;
    onAddHost: () => void;
    onCloseMenu: () => void;
}> = ({ onDelete, onAddHost, onCloseMenu }) => (
    <div
        className={styles.roomButtonEdit}
        style={{
            position: "absolute",
            zIndex: 100,
        }}
        onClick={(e) => e.stopPropagation()}
    >
        <button
            className={styles.delRoom}
            onClick={() => {
                onDelete();
                onCloseMenu();
            }}
        >
            刪除Rack
        </button>
        <button
            className={styles.addRack}
            onClick={() => {
                onAddHost();
                onCloseMenu();
            }}
        >
            [+]Host
        </button>
    </div>
);

const RoomActionMenu: React.FC<{
    onDelete: () => void;
    onAddRack: () => void;
}> = ({ onDelete, onAddRack }) => (
    <div
        className={styles.roomButtonEdit}
        style={{
            position: "absolute",
            //   top: `${top}px`,
            //   left: `${left}px`,
            zIndex: 100,
        }}
        onClick={(e) => e.stopPropagation()}
    >
        <div className={styles.roomCtrlMenu}>
            <button className={styles.delRoom} onClick={onDelete}>
                <span className={styles.subButtonTitle}>刪除Room</span>
            </button>
            <button className={styles.addRack} onClick={onAddRack}>
                <span className={styles.subButtonTitle}>[+]Rack</span>
            </button>
        </div>
    </div>
);

const DataCenterComponentSection: React.FC<DataCenterComponentSectionProps> = ({
    dataCenters,
}) => {
    const max_units = (dcId: number | undefined): string[] => {
        const rooms = filterRoomsByDataCenterId(dcId);
        if (!rooms || rooms.length === 0)
            return ["Unit", "1", "2", "3", "4", "5", "6", "7", "8", "9"]; // Default value if no rooms
        const maxUnit = Math.max(...rooms.map((room) => room.unit));
        return [
            "Unit",
            ...Array.from({ length: maxUnit }, (_, i) => (i + 1).toString()),
        ];
    };

    const [clickedCells, setClickedCells] = useState<{
        [side: string]: Set<string>;
    }>({
        left: new Set(),
        right: new Set(),
    });
    const [isRackmodalOpen, setRackModalOpen] = useState(false);

    const [clickedRoomId, setClickedRoomId] = useState<number | null>(null);
    const [hoveredRoomId, setHoveredRoomId] = useState<number | null>(null);
    const [clickedRackId, setClickedRackId] = useState<number | null>(null);
    const [hoveredRackId, setHoveredRackId] = useState<number | null>(null);
    const [rackMenuOverlay, setRackMenuOverlay] = useState<{
        rackId: number | null;
        pos: { top: number; left: number };
    }>({ rackId: null, pos: { top: 0, left: 0 } });
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const [overlayInfo, setOverlayInfo] = useState<{
        roomId: number | null;
        pos: { top: number; left: number };
    }>({ roomId: null, pos: { top: 0, left: 0 } });

    // ✅ 在元件頂層呼叫 useQuery 來獲取房間和機櫃資料
    const {
        data: roomsData,
        isLoading: isLoadingRooms,
        isError: isErrorRooms,
    } = useGetRoomQuery();
    const {
        data: racksData,
        isLoading: isLoadingRacks,
        isError: isErrorRacks,
    } = useGetRackQuery();
    const { mutate: deleteRoombyID } = useDeleteRoomMutation();
    const { mutate: deleteRackbyID } = useDeleteRackMutation(); 

    const handleCellClick = (localSide: "left" | "right", cellKey: string) => {
        setClickedCells((prev) => {
            const newSet = new Set(prev[localSide]);
            newSet.has(cellKey) ? newSet.delete(cellKey) : newSet.add(cellKey);
            return { ...prev, [localSide]: newSet };
        });
    };
    // console.log('isRackModalOpen:', isRackModalOpen);

    const filterRoomsByDataCenterId = (dcId: number | undefined): Room[] => {
        return roomsData
            ? roomsData.filter((room: Room) => room.dataCenterId === dcId)
            : [];
    };

    const filterRacksByRoomId = (roomId: number | undefined): Rack[] => {
        return racksData
            ? racksData.filter((rack: Rack) => rack.roomId === roomId)
            : [];
    };

    const renderRoomHeaders = (room: Room) => {
        const rackCount =
            racksData?.filter((rack) => rack.roomId === room.id).length ?? 0;
        const isClicked = clickedRoomId === room.id;
        const isHovered = hoveredRoomId === room.id;

        const handleClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const top = rect.bottom + window.scrollY;
            const left = rect.left + rect.width / 2 + window.scrollX;

            const isSameRoom = clickedRoomId === room.id;

            setClickedRoomId(isSameRoom ? null : room.id);
            setOverlayInfo(
                isSameRoom
                    ? { roomId: null, pos: { top: 0, left: 0 } }
                    : { roomId: room.id, pos: { top, left } }
            );
        };

        const handleDelete = () => {
            deleteRoombyID(room.id.toString());
        };

        const handleAddRack = () => {
            setSelectedRoom(room);
            setRackModalOpen(true);
        };

        return (
            <TableHead
                key={room.id}
                colSpan={rackCount}
                className={`${styles.roomHeader} ${isClicked ? styles.clicked : ""}`}
                onClick={handleClick}
                onMouseEnter={() => {
                    if (clickedRoomId === null) setHoveredRoomId(room.id);
                }}
                onMouseLeave={() => {
                    if (clickedRoomId === null) setHoveredRoomId(null);
                }}
            >
                <div className={styles.roomContent}>
                    <span className={styles.roomTitle}>
                        {isClicked || isHovered ? "編輯Room" : room.name}
                    </span>

                    {overlayInfo.roomId === room.id && (
                        <RoomActionMenu onDelete={handleDelete} onAddRack={handleAddRack} />
                    )}
                </div>
            </TableHead>
        );
    };
    const renderRackHeaders = (room: Room) => {
        const racks = filterRacksByRoomId(room.id);
        return racks.map((rack) => {
          const isClicked = clickedRackId === rack.id;
          const isHovered = hoveredRackId === rack.id;
      
          const handleClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const top = rect.bottom + window.scrollY;
            const left = rect.left + rect.width / 2 + window.scrollX;
      
            const isSame = clickedRackId === rack.id;
            setClickedRackId(isSame ? null : rack.id);
            setRackMenuOverlay(
              isSame
                ? { rackId: null, pos: { top: 0, left: 0 } }
                : { rackId: rack.id, pos: { top, left } }
            );
          };
      
          const handleDelete = () => {
            deleteRackbyID(rack.id.toString());
          };
      
          const handleAddHost = () => {
            console.log("新增Host到Rack", rack.id);
          };
      
          const handleCloseMenu = () => {
            setClickedRackId(null);
            setRackMenuOverlay({ rackId: null, pos: { top: 0, left: 0 } });
          };
      
          return (
            <TableHead
              key={`${room.name}-${rack.name}`}
              className={`${styles.rackHeader} ${isClicked ? styles.clicked : ""}`}
              onClick={handleClick}
              onMouseEnter={() => setHoveredRackId(rack.id)}
              onMouseLeave={() => setHoveredRackId(null)}
            >
              <span className={styles.rackTitle}>
                {isClicked || isHovered ? "編輯Rack" : rack.name}
              </span>
      
              {rackMenuOverlay.rackId === rack.id && (
                <RackActionMenu
                  top={rackMenuOverlay.pos.top}
                  left={rackMenuOverlay.pos.left}
                  onDelete={handleDelete}
                  onAddHost={handleAddHost}
                  onCloseMenu={handleCloseMenu}
                />
              )}
            </TableHead>
          );
        });
      };
      
    const { mutate: deleteDC, isLoading: isDeleting } =
        useDeleteDataCenterMutation();
    const handleDelete = (id: number) => {
        if (window.confirm("確定要刪除這個資料中心？")) {
            deleteDC(id);
        }
    };

    const { mutate: addRoom, isLoading: isAddingRoom } = useAddRoomMutation();
    // const { mutate: addRack, isLoading: isAddingRack } = useAddRackMutation();

    const [hoveredbuttonId, setHoveredbuttonId] = useState<number | null>(null);
    const [clickedId, setClickedId] = useState<number | null>(null);

    // handel roommodal
    const [isRoommodalOpen, setCreateModalOpen] = useState(false);
    const [selectedDC, setSelectedDC] = useState<DataCenter | null>(null); // optional, for editing
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null); // optional, for editing

    const handleCloseRoommodal = () => {
        setCreateModalOpen(false);
    };
    const roomMutation = useAddRoomMutation();
    const rackMutation = useAddRackMutation();
    const renderDataTable = (
        dataCentersList: DataCenter[],
        side: "left" | "right"
    ) =>
        // const [isCreateModalOpen, setCreateModalOpen] = useState(false);

        dataCentersList.map((dc) => (
            <div
                key={`favorite-table-${side}-${dc.id}`}
                className={styles.tableContainer}
            >
                {/* ✅ Custom header placed ABOVE the table */}
                <div
                    className={cn(
                        styles.dcHeader,
                        hoveredbuttonId === dc.id && styles.dcHeaderHovered
                    )}
                    onMouseEnter={() => {
                        setHoveredbuttonId(dc.id);
                    }}
                    onMouseLeave={() => {
                        setHoveredbuttonId(null);
                        setClickedId(null);
                    }}
                    onClick={() => {
                        if (hoveredbuttonId === dc.id) setClickedId(dc.id);
                    }}
                >
                    {clickedId === dc.id && (
                        <div className={styles.actionButtons}>
                            <Button
                                className={styles.deletedc}
                                onClick={() => handleDelete(dc.id)}
                                disabled={isDeleting}
                            >
                                刪除DC
                            </Button>
                            <Button
                                className={styles.create_room}
                                onClick={() => {
                                    setSelectedDC(dc);
                                    setCreateModalOpen(true);
                                }}
                                disabled={isAddingRoom}
                            >
                                [+]Room
                            </Button>
                        </div>
                    )}
                    <span className={styles.dcTitle}>
                        {hoveredbuttonId === dc.id ? "編輯DC" : dc.name}
                    </span>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className={styles.unitHeader}></TableHead>
                            {filterRoomsByDataCenterId(dc.id).map((room) =>
                                renderRoomHeaders(room)
                            )}
                        </TableRow>
                        <TableRow>
                            <TableHead className={styles.unitHeader}>
                                <span className={styles.unitTitle}>Unit</span>
                            </TableHead>
                            {filterRoomsByDataCenterId(dc.id).flatMap((room) => renderRackHeaders(room))}
                        </TableRow>

                    </TableHeader>
                    <TableBody>
                        {max_units(dc.id)
                            .slice(1)
                            .map((unit) => (
                                <TableRow key={unit}>
                                    <TableCell className={styles.unitHeader}>
                                        <span className={styles.unitTitle}>{unit}</span>
                                    </TableCell>
                                    {filterRoomsByDataCenterId(dc.id).flatMap((room) =>
                                        filterRacksByRoomId(room.id).map((rack) => {
                                            const cellKey = `${dc.id}-${unit}-${room.name}-${rack.name}-${side}`;
                                            const isClicked = clickedCells[side]?.has(cellKey);
                                            const isDisabled = room.unit < parseInt(unit);

                                            return (
                                                <TableCell
                                                    key={cellKey}
                                                    onClick={
                                                        isDisabled
                                                            ? undefined
                                                            : () => handleCellClick(side, cellKey)
                                                    }
                                                    // className={cn(
                                                    //     styles.unitCell,
                                                    //     isClicked && styles.clickedCell,
                                                    //     isDisabled && styles.disabledCell
                                                    // )}
                                                    className={`${styles.unitCell} ${isClicked ? styles.clickedCell : ""
                                                        }`}
                                                />
                                            );
                                        })
                                    )}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        ));

    return (
        <>
            <Card className={styles.combinedComponentCard}>
                <div className={styles.headerButtonArea}></div>
                <div className={styles.titleArea}>
                    <div className={styles.titleWrapper}>
                        <Separator className={styles.leftSeparator} />
                        <h2 className={styles.title}>常用資料中心</h2>
                        <Separator className={styles.rightSeparator} />
                    </div>
                </div>
                <div className={styles.tablesWrapper}>
                    {renderDataTable(dataCenters.left, "left")}
                    {renderDataTable(dataCenters.right, "right")}
                </div>
            </Card>
            <div>
                {/* <RoomModal
                isOpen={isRoommodalOpen}
                onClose={handleCloseRoommodal}
                currentDataCenter={selectedDC}
            /> */}

                {selectedDC && (
                    <CreateModal
                        isOpen={isRoommodalOpen}
                        onClose={handleCloseRoommodal}
                        title="新增房間"
                        fields={[
                            { name: "name", label: "房間名稱", type: "text", required: true },
                            {
                                name: "unit",
                                label: "房間高度",
                                type: "number",
                                defaultValue: 10,
                            },
                        ]}
                        mutation={roomMutation}
                        extraData={{ dataCenterId: selectedDC.id }}
                    />
                )}

                {selectedRoom && (
                    <CreateModal
                        isOpen={isRackmodalOpen}
                        onClose={() => {
                            setRackModalOpen(false);
                            setSelectedRoom(null);
                        }}
                        title="新增Rack"
                        fields={[
                            { name: "name", label: "Rack名稱", type: "text", required: true },
                            {
                                name: "height",
                                label: "Rack高度",
                                type: "number",
                                defaultValue: 10,
                            },
                            { name: "tag", label: "Rack tag", type: "text", required: true },
                        ]}
                        mutation={rackMutation}
                        extraData={{ roomId: selectedRoom.id }}
                    />
                )}
            </div>
        </>
    );
};

export default DataCenterComponentSection;
