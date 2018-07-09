import { DataAvailability } from "../enums/data-availability";

export interface ICustomData {
    type: string;
    id?: string | number;
    availability: DataAvailability;
    data: any;
    username?: string;
}
