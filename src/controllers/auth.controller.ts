import { Controller, Post, RequestBody, Autowired, IOnInit, Get } from "express-utils";
import { IJiraAuthService } from "../services/jira-auth/i-jira-auth.service";
import { BadRequest } from "http-errors";
import { ITokenContent } from "../interfaces/i-token-content";
import TokenContents from "../decorators/token.decorator";

@Controller("/auth")
export default class AuthController implements IOnInit {

    @Autowired()
    public jiraAuthService: IJiraAuthService;

    public onInit(): void {
        console.log(this.constructor.name, "initialised");
    }

    /**
     * Attempts a login with jira using the given username and password on the given jira domain
     * @RequestBody {{domain: string, username: string, password: string}} body a json object containing the username and password
     * @returns string an authentication token to be used on subsequent requests
     */
    @Post("/login")
    public async login(@RequestBody() body): Promise<any> {
        if (!body || !body.domain || !body.username || !body.password) {
            throw new BadRequest("domain, username and password are required in the request body");
        }
        const token: string = await this.jiraAuthService.authenticate(body.domain, body.username, body.password);
        return { token };
    }

    @Get("/whoami")
    public async whoami(@TokenContents() token: ITokenContent): Promise<ITokenContent> {
        return token;
    }
}
