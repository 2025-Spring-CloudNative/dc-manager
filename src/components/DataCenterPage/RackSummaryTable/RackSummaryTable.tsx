// RackSummaryTable.tsx

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
// import { DataCenters, DataCenter } from "@/components/data/rackData";

// react query for data fetching
import { useGetDataCentersQuery } from "@/features/dataCenter/hooks/useDataCenter";
import { useGetRoomQuery, useGetRoomByIdQuery } from "@/features/Rooms/hooks/useRoom"; 
import { useGetRackQuery} from "@/features/Racks/hooks/useRack";
import { AxiosError } from 'axios';
import { useEffect } from "react";
import { logApiData } from "@/features/log/console";
import { DataCenter } from "@/components/data/datacenter";
import { Room } from "@/components/data/room";
import { Rack } from "@/components/data/rack";


interface RoomCountCellProps {
  dcId: number;
}

// count total number of rooms by data center id and total number of racks by room id
const RoomCountCell: React.FC<RoomCountCellProps> = ({ dcId }) => {
  const { data, isLoading, isError } = useGetRoomQuery();
  const { data: rack, isLoading: isLoading_rack, isError: isError_rack} = useGetRackQuery();

  // debug on api data
  // useEffect(() => {
  //   if (rack && !isLoading && !isError) {
  //     logApiData(rack, 'Room Query Result');
  //   }
  // }, [data, isLoading, isError])

  // room count
  if (isLoading) return <TableCell>Loading...</TableCell>;
  if (isError) return <TableCell>Error</TableCell>;

  const roomData = data.filter((room: Room) => {return room.dataCenterId === dcId;});
  const roomCount = roomData.length;

  // rack count
  if (isLoading_rack) return <TableCell>Loading...</TableCell>;
  if (isError_rack) return <TableCell>Error</TableCell>;

  const rackData = rack.filter((rack: Rack) => 
    roomData.some((room: Room) => room.id === rack.roomId)
  );
  const rackCount = rackData.length;

  return (
    <>
      <TableCell>{roomCount}</TableCell>
      <TableCell>{rackCount}</TableCell>
    </>
  );
  
};

interface RackSummaryTableProps {
  onAddToLeft: (dataCenter: DataCenter) => void;
  onAddToRight: (dataCenter: DataCenter) => void;
}

const renderDataCenters = (
  data: DataCenter[],
  onAddToLeft: (dc: DataCenter) => void,
  onAddToRight: (dc: DataCenter) => void
) =>
  data.map((dc, index) => (
    
    <TableRow key={index}>
      
      <TableCell>{dc.name}</TableCell>
      {/* <TableCell>{dc.rackCount}</TableCell> */}
      <RoomCountCell dcId={dc.id} />
      {/* <TableCell>
        <div className={styles.ButtonGroup}>
          {dc.hosts.slice(0, 5).map((host, hostIndex) => (
            <Button key={hostIndex} className={styles.infoButton}>
              {host}
            </Button>
          ))}
          {dc.hosts.length > 5 && (
            <Button className={styles.infoButton}>...</Button>
          )}
        </div>
      </TableCell> */}
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
    </TableRow>
  )
);

const RackSummaryTable: React.FC<RackSummaryTableProps> = ({ onAddToLeft, onAddToRight }) => {
  const {
    data: dataCenters,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetDataCentersQuery();

  return (
    <Card className={styles.dataCenterCard}>
      <div className={styles.tableWrapper}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>資料中心</TableHead>
              <TableHead>Room 數量</TableHead>
              <TableHead>Rack 數量</TableHead>
              {/* <TableHead>現有機器</TableHead> */}
              <TableHead>釘選/加到常用</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            
            {isLoading && (
                <TableRow>
                  <TableCell colSpan={4}>Loading...</TableCell>
                </TableRow>
              )}
            
            {isError && (() => {
              const axiosError = error as AxiosError<{ message?: string }>;

              return (
                <TableRow>
                  <TableCell colSpan={4}>
                    Error: {axiosError.response?.data?.message || axiosError.message || 'Unknown error'}
                  </TableCell>
                </TableRow>
              );
            })()}
            {dataCenters && renderDataCenters(dataCenters, onAddToLeft, onAddToRight)}
            
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default RackSummaryTable;