import React from 'react';
import styles from './ServiceRackTable.module.scss';
import { getlocalIPAddressbyMachineID} from "@/features/IPAddress/hooks/IPAddress";
import { getRoombyid} from "@/features/Rooms/hooks/useRoom"
import { getDCbyId} from "@/features/dataCenter/hooks/useDataCenter"
import { Rack  } from "@/features/Racks/types";
import { Machine} from "@/features/Machine/types"

export default function ServiceRackMachineRow({
  machine,
  rack,
}: {
  machine: Machine;
  rack: Rack;
})  {

  const { data: IPaddress, isLoading: isLoadingIPAddress} = getlocalIPAddressbyMachineID(machine.id!);
  const { data: RoomData, isLoading: isLoadingRoom} = getRoombyid(rack.roomId!);

  const r = RoomData?.[0];
  const dcId = r?.dataCenterId ?? 0;
  const { data: dcData, isLoading: isLoadingDC} = getDCbyId(dcId);

  if (isLoadingIPAddress || isLoadingRoom || !IPaddress || !RoomData || isLoadingDC || !dcData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.machineRow}>
      <div className={`${styles.status} ${machine.status === "active" ? styles.activeStatus : ""}`}>
        <span className={styles.statusText}>{machine.status}</span>
      </div>
      <div className={styles.tableRowText} style={{ width: '135px' }}>{machine.name}</div>
      <div className={styles.sepLine}></div>
      <div className={styles.tableRowText} style={{ width: '135px' }}>{IPaddress[0].address}</div>
      <div className={styles.sepLine}></div>
      <div className={styles.tableRowText} style={{ flex: 1 }}>
          {dcData[0].name} / {RoomData[0].name} / {rack.name} / Unit {machine.startUnit}-{machine.startUnit + machine.unit}
      </div>
      
    </div>
  );
}
