import { ITokenContent } from "../../interfaces/i-token-content";

export interface IJwtService {
    create(tokenBody: ITokenContent): string;
    unpack(token: string): ITokenContent;
}