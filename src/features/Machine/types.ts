export type Machine = {
    id?: number;
    rackId: number;
    name: string;
    macAddress: string;
    startUnit: number;
    unit: number;
    createdAt?: string;
    status?: string;
}