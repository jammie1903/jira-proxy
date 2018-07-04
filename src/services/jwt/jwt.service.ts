import { Service, Autowired } from "express-utils";
import { IJwtService } from "./i-jwt.service";
import * as jwt from "jsonwebtoken";
import { ISecretService } from "../secret/i-secret.service";
import { Unauthorized } from "http-errors";
import { ITokenContent } from "../../interfaces/i-token-content";

@Service("jwtService")
export default class JwtService implements IJwtService {

    @Autowired()
    private secretService: ISecretService;

    public onInit(): void {
        console.log(this.constructor.name, "initialised");
    }

    create(tokenBody: ITokenContent): string {
        return jwt.sign(tokenBody, this.secretService.get());
    }

    unpack(token: string): ITokenContent {
        try {
            return jwt.verify(token, this.secretService.get());
        } catch (err) {
            throw new Unauthorized(err.message ? err : err.message)
        }
    }
}
