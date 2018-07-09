import { IUserData } from "../../interfaces/i-user-data";
import { IBoard } from "../../interfaces/i-board";

export interface IJiraService {
    getBoards(userDetails: IUserData): Promise<IBoard[]>;
    getBoard(userDetails: IUserData, boardId: number): Promise<IBoard>;
}