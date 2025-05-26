export interface Machine {
    id: number;
    rackId: number;
    name: string;
    macAddress: string;
    startUnit: number;
    unit: number;
    createdAt: Date;
    status: string;
}