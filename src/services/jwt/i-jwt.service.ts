import { IUserData } from "../../interfaces/i-user-data";

export interface IJwtService {
    create(tokenBody: IUserData): string;
    unpack(token: string): IUserData;
}