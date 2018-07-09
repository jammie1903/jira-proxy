import { IUserData } from "../../interfaces/i-user-data";
import { IBoard } from "../../interfaces/i-board";
import { ISprint } from "../../interfaces/i-sprint";

export interface IJiraService {
    getBoards(userDetails: IUserData): Promise<IBoard[]>;
    getBoard(userDetails: IUserData, boardId: number): Promise<IBoard>;
    getSprint(userDetails: IUserData, sprintId: number): Promise<ISprint>;
}