import { IUserData } from "../../interfaces/i-user-data";
import { IBoard } from "../../interfaces/i-board";
import { ICustomData } from "../../interfaces/i-custom-data";

export interface ICustomDataService {
    storeCustomData(userDetails: IUserData, customData: ICustomData): Promise<void>;
    getOwnCustomData(userDetails: IUserData, type: string, identifier?: string | number): Promise<ICustomData>;
    getAllCustomData(userDetails: IUserData, type: string, identifier?: string | number): Promise<ICustomData[]>;
}
