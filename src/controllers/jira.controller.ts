import { Controller, Autowired, IOnInit, Get, RequestParam } from "express-utils";
import { IJiraService } from "../services/jira/i-jira.service";
import { BadRequest } from "http-errors";
import { IUserData } from "../interfaces/i-user-data";
import TokenContents from "../decorators/token.decorator";
import { IBoard } from "../interfaces/i-board";
import { ISprint } from "../interfaces/i-sprint";

@Controller("/jira")
export default class JiraController implements IOnInit {

    @Autowired()
    public jiraService: IJiraService;

    public onInit(): void {
        console.log(this.constructor.name, "initialised");
    }

    @Get("/boards")
    public getBoards(@TokenContents() token: IUserData): Promise<IBoard[]> {
        return this.jiraService.getBoards(token);
    }

    @Get("/board/:boardId")
    public getBoard(@TokenContents() token: IUserData, @RequestParam("boardId") boardId: number): Promise<IBoard> {
        return this.jiraService.getBoard(token, boardId);
    }

    @Get("/sprint/:sprintId")
    public getSprint(@TokenContents() token: IUserData, @RequestParam("sprintId") sprintId: number): Promise<ISprint> {
        return this.jiraService.getSprint(token, sprintId);
    }
}
