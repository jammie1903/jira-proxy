import { Controller, Autowired, IOnInit, Get, RequestParam, QueryParam, Post, RequestBody } from "express-utils";
import { IJiraService } from "../services/jira/i-jira.service";
import { BadRequest } from "http-errors";
import { IUserData } from "../interfaces/i-user-data";
import TokenContents from "../decorators/token.decorator";
import { IBoard } from "../interfaces/i-board";
import { ICustomDataService } from "../services/custom-data/i-custom-data.service";
import { ICustomData } from "../interfaces/i-custom-data";
import { DataAvailability } from "../enums/data-availability";

@Controller("/data")
export default class DataController implements IOnInit {

    @Autowired()
    public customDataService: ICustomDataService;

    public onInit(): void {
        console.log(this.constructor.name, "initialised");
    }

    @Get("/:type")
    public getOwn(@TokenContents() token: IUserData,
        @RequestParam("type") type: string,
        @QueryParam("id") id: string): Promise<ICustomData> {
        return this.customDataService.getOwnCustomData(token, type, id);
    }

    @Get("/all/:type")
    public getAll(@TokenContents() token: IUserData,
        @RequestParam("type") type: string,
        @QueryParam("id") id: string): Promise<ICustomData[]> {
        return this.customDataService.getAllCustomData(token, type, id);
    }

    @Post("/:type")
    public setData(@TokenContents() token: IUserData,
        @RequestParam("type") type: string,
        @QueryParam("id") id: string,
        @QueryParam("availability") availability: DataAvailability,
        @RequestBody() body: any): Promise<void> {
        return this.customDataService.storeCustomData(token, {
            availability: availability || DataAvailability.public,
            data: body,
            id,
            type,
        });
    }
}
