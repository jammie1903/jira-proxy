import { Service, Autowired } from "express-utils";
import { IJiraAuthService } from "./i-jira-auth.service";
import * as HttpErrors from "http-errors";
import fetch from "node-fetch";
import { ISecretService } from "../secret/i-secret.service";
import { IJwtService } from "../jwt/i-jwt.service";
import { ITokenContent } from "../../interfaces/i-token-content";

@Service("jiraAuthService")
export default class JiraAuthService implements IJiraAuthService {

    @Autowired()
    private secretService: ISecretService
    @Autowired()
    private jwtService: IJwtService;

    public onInit(): void {
        console.log(this.constructor.name, "initialised");
    }

    private safeUrl(url) {
        // check if url has a protocol specified
        if (/\w+\:\/\//.test(url)) {
            return url;
        }
        // default to http is no protocol is specified, to prevent AngularJS treating it as untrusted
        return "http://" + url;
    }

    public authenticate(jiraUrl: string, username: string, password: string): Promise<string> {
        const auth = Buffer.from(username + ":" + password).toString("base64");
        const url = this.safeUrl(jiraUrl);
        return fetch(url + '/rest/api/2/myself', {
            headers: {
                authorization: 'Basic ' + auth
            }
        }).then(res => {
            if (res.status !== 200) {
                throw HttpErrors(res.status);
            }
            return res.json()
                .then(json => this.jwtService.create(this.createJWTBody(url, json, auth)))

        }).catch(err => {
            if(!err.status && err.code === "ENOTFOUND") {
                throw new HttpErrors.BadRequest(`The domain ${jiraUrl} could not be found`);
            }
            throw err;
        });
    }

    private createJWTBody(jiraUrl: string, jiraData: any, authToken: string): ITokenContent {
        const encryptedAuthToken = this.secretService.encrypt(authToken);

        return {
            name: jiraData.displayName,
            email: jiraData.emailAddress,
            username: jiraData.key,
            accountId: jiraData.accountId,
            avatar: jiraData.avatarUrls["32x32"],
            jiraAuth: encryptedAuthToken,
            jiraUrl,
        }
    }

}
