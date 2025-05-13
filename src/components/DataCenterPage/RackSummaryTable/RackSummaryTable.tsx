import { useState } from "react";
import Button from "@/components/shared/Button";
import Card from "@/components/DataCenterPage/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/Table";

import styles from "./RackSummaryTable.module.scss";
import { useGetDataCentersQuery, useDeleteDataCenterMutation } from "@/features/dataCenter/hooks/useDataCenter";
import CreateDCmodal from "@/components/DataCenterPage/DCmodal";
import { useGetRoomQuery } from "@/features/Rooms/hooks/useRoom"; 
import { useGetRackQuery } from "@/features/Racks/hooks/useRack";
import { useGetSubnetByIdQuery } from "@/features/subnet/hooks/useSubnet";

import { AxiosError } from 'axios';
import { DataCenter } from "@/components/data/datacenter";
import { Room } from "@/components/data/room";
import { Rack } from "@/components/data/rack";

interface RoomCountCellProps {
  dcId: number;
}

const RoomCountCell: React.FC<RoomCountCellProps> = ({ dcId }) => {
  const { data, isLoading, isError } = useGetRoomQuery();
  const { data: rack, isLoading: isLoading_rack, isError: isError_rack } = useGetRackQuery();

  if (isLoading || isLoading_rack) return <><TableCell>Loading...</TableCell><TableCell>Loading...</TableCell></>;
  if (isError || isError_rack) return <><TableCell>Error</TableCell><TableCell>Error</TableCell></>;

  const roomData = data.filter((room: Room) => room.dataCenterId === dcId);
  const rackData = rack.filter((rack: Rack) =>
    roomData.some((room: Room) => room.id === rack.roomId)
  );

  return (
    <>
      <TableCell>{roomData.length}</TableCell>
      <TableCell>{rackData.length}</TableCell>
    </>
  );
};

interface RackSummaryTableProps {
  onAddToLeft: (dataCenter: DataCenter) => void;
  onAddToRight: (dataCenter: DataCenter) => void;
  onEditDataCenter?: (dataCenter: DataCenter) => void; // Optional handler for edit
}

const RackSummaryTable: React.FC<RackSummaryTableProps> = ({ onAddToLeft, onAddToRight, onEditDataCenter }) => {
  const {
    data: dataCenters,
    isLoading,
    isError,
    error,
  } = useGetDataCentersQuery();
  

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [selectedDC, setSelectedDC] = useState<DataCenter | null>(null); // optional, for editing
  //create
  const handleOpenCreateModal = () => {
    setSelectedDC(null); // reset for "create"
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };


  //delete
  const { mutate: deleteDC, isLoading: isDeleting } = useDeleteDataCenterMutation();
  const handleDelete = (id: string) => {
    if (window.confirm("確定要刪除這個資料中心？")) {
      deleteDC(id);
    }
  };

  return (<div>
    <Card className={styles.dataCenterCard}>
      <div className={styles.tableWrapper}>
        <div className={styles.buttonWrapper}>
          <Button className={styles.addDCButton} onClick={handleOpenCreateModal}>
              [+]dataCenter
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>資料中心</TableHead>
              <TableHead>DC location</TableHead>
              <TableHead>DC Subnet CIDR</TableHead>
              <TableHead>Room 數量</TableHead>
              <TableHead>Rack 數量</TableHead>
              <TableHead>釘選/加到常用</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7}>Loading...</TableCell>
              </TableRow>
            )}
            {isError && (() => {
              const axiosError = error as AxiosError<{ message?: string }>;
              return (
                <TableRow>
                  <TableCell colSpan={5}>
                    Error: {axiosError.response?.data?.message || axiosError.message || "Unknown error"}
                  </TableCell>
                </TableRow>
              );
            })()}
            {dataCenters && dataCenters.map((dc, index) => (
              <TableRow key={index}>
                <TableCell>{dc.name}</TableCell>
                <TableCell>{dc.location}</TableCell>
                {(() => {
                  const { data: subnet, isLoading: isSubnetLoading, isError: isSubnetError } = useGetSubnetByIdQuery(dc.subnetId?.toString() || "");

                  if (!dc.subnetId) return <TableCell>-</TableCell>;
                  if (isSubnetLoading) return <TableCell>Loading...</TableCell>;
                  if (isSubnetError) return <TableCell>Error</TableCell>;

                  return <TableCell>{subnet?.cidr || "-"}</TableCell>;
                })()}
                <RoomCountCell dcId={dc.id} />

                <TableCell>
                  <div className={styles.favoriteGroup}>
                    <Button
                      className={`${styles.infoButton} ${styles.favoriteButton}`}
                      onClick={() => onAddToLeft(dc)}
                    >
                      加到left
                    </Button>
                    <Button
                      className={`${styles.infoButton} ${styles.favoriteButton}`}
                      onClick={() => onAddToRight(dc)}
                    >
                      加到right
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={styles.favoriteGroup}>
                    <Button
                      className={`${styles.infoButton} ${styles.editButton}`}
                      onClick={() => {
                        setSelectedDC(dc);       // 設定要編輯的資料中心
                        setCreateModalOpen(true); // 開啟 modal
                      }}
                    >
                      編輯
                    </Button>
                    <Button
                      className={`${styles.infoButton} ${styles.deleteButton}`}
                      onClick={() => handleDelete(dc.id.toString())}
                      disabled={isDeleting}
                    >
                      刪除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </Card>
    <CreateDCmodal
      isOpen={isCreateModalOpen}
      onClose={handleCloseCreateModal}
      currentDataCenter={selectedDC}
    />
     </div>
  );
};

export default RackSummaryTable;
