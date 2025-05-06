export interface DataCenter {
  id: string;
  rackCount: number;
  unitCount: number;
  hosts: string[];
  rooms: {
    name: string;
    racks: string[];
  }[];
}

export const DataCenters: DataCenter[] = [
  {
    id: "DC-A",
    rackCount: 3,
    unitCount: 12, // Assuming 4 units per rack
    hosts: ["A-1", "A-2", "A-1"],
    rooms: [
      { name: "Room Alpha", racks: ["Rack 1A", "Rack 1B", "Rack 1C"] },
      { name: "Room Beta", racks: ["Rack 2A", "Rack 2B"] },
    ],
  },
  {
    id: "DC-B",
    rackCount: 4,
    unitCount: 16,
    hosts: ["B-1", "B-2", "B-3"],
    rooms: [
      { name: "Room Gamma", racks: ["Rack 3A", "Rack 3B", "Rack 3C", "Rack 3D"] },
    ],
  },
  {
    id: "DC-C",
    rackCount: 4,
    unitCount: 16,
    hosts: ["C-1", "C-1", "C-2"],
    rooms: [
      { name: "Room Delta", racks: ["Rack 4A"] },
      { name: "Room Epsilon", racks: ["Rack 5A", "Rack 5B", "Rack 5C"] },
    ],
  },
  {
    id: "DC-D-Left",
    rackCount: 3,
    unitCount: 12,
    hosts: ["D-1", "D-2", "D-1"],
    rooms: [
      { name: "Room Zeta", racks: ["Rack 6A", "Rack 6B"] },
      { name: "Room Eta", racks: ["Rack 7A"] },
    ],
  },
  {
    id: "DC-E-Right",
    rackCount: 3,
    unitCount: 12,
    hosts: ["E-1", "E-2"],
    rooms: [
      { name: "Room Theta", racks: ["Rack 8A", "Rack 8B", "Rack 8C"] },
    ],
  },
];

// We no longer need RackSummaryItem as the DataCenter interface now includes the necessary properties.
// export interface RackSummaryItem {
//   name: string;
//   rackCount: number;
//   unitCount: number;
//   hosts: string[];
// }

// The data is now directly in the DataCenters array, so we don't need a separate generation function or constant.
// export const generateRackSummaryData = (dataCenters: DataCenter[]): RackSummaryItem[] => { ... };
// export const RackSummaryData: RackSummaryItem[] = generateRackSummaryData(DataCenters);