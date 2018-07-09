import { Service, Autowired } from "express-utils";
import { IJiraService } from "./i-jira.service";
import * as HttpErrors from "http-errors";
import fetch from "node-fetch";
import { IUserData } from "../../interfaces/i-user-data";
import { IBoard } from "../../interfaces/i-board";
import { ISprint } from "../../interfaces/i-sprint";

@Service("jiraService")
export default class JiraService implements IJiraService {

    public async getBoard(userDetails: IUserData, jiraBoardId: number): Promise<IBoard> {
        const [board, sprints] = await Promise.all([
            this.fetchBoard(userDetails, jiraBoardId),
            this.getSprints(userDetails, jiraBoardId)
        ]);
        board.sprints = sprints;
        return board;
    }

    private async fetchBoard(userDetails: IUserData, jiraBoardId: number) {
        const json = await this.fetchJSON(`${userDetails.jiraUrl}/rest/agile/1.0/board/${jiraBoardId}`, {
            headers: {
                authorization: "Basic " + userDetails.jiraAuth
            }
        })
        return this.mapBoard(userDetails, json);
    }

    public async getBoards(userDetails: IUserData): Promise<IBoard[]> {
        const json = await this.fetchJSON(`${userDetails.jiraUrl}/rest/agile/1.0/board?type=scrum&maxResults=50`, {
            headers: {
                authorization: "Basic " + userDetails.jiraAuth
            }
        });
        return json.values.map(result => this.mapBoard(userDetails, result));
    }

    private mapBoard(userDetails: IUserData, board: any): IBoard {
        return {
            id: board.id,
            name: board.name,
            link: board.self,
            avatar: userDetails.jiraUrl + board.location.avatarURI,
        }
    }

    public async getSprint(userDetails: IUserData, sprintId: number) {
        const json = await this.fetchJSON(
            `${userDetails.jiraUrl}/rest/agile/1.0/sprint/${sprintId}`,
            {
                headers: {
                    authorization: "Basic " + userDetails.jiraAuth
                }
            });
        return this.mapSprint(json);
    }

    private async getSprints(userDetails: IUserData, jiraBoardId: number) {
        let returnList: ISprint[] = [];
        let page = 0;
        while (true) {
            const json = await this.fetchJSON(
                `${userDetails.jiraUrl}/rest/agile/1.0/board/${jiraBoardId}/sprint?state=active,closed&maxResults=50&startAt=${page * 50}`,
                {
                    headers: {
                        authorization: "Basic " + userDetails.jiraAuth
                    }
                });
            returnList = returnList.concat(json.values.map(sprint => this.mapSprint(sprint)));
            if (json.isLast) {
                return returnList.sort((a, b) => b.startDate - a.startDate);
            }
            page++;
        }
    }

    private mapSprint(sprint: any): ISprint {
        return {
            id: sprint.id,
            name: sprint.name,
            link: sprint.self,
            startDate: new Date(sprint.startDate).getTime(),
            endDate: new Date(sprint.endDate).getTime()
        };
    }

    private async fetchJSON(url, options) {
        const response = await fetch(url, options);
        if (response.status !== 200) {
            throw HttpErrors(response.status);
        }
        return response.json();
    }
}
