import { ISprint } from "./i-sprint";

export interface IBoard {
    id: number;
    name: string;
    link: string;
    avatar: string;
    sprints?: ISprint[];
}
