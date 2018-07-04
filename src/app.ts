import * as path from "path";
import { NextFunction, Request, Response } from "express";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import { HttpError, NotFound, InternalServerError } from "http-errors";
import { Application, ApiReference, ExpressApp, Dictionary } from "express-utils";

@Application(path.join(__dirname, "services"), path.join(__dirname, "controllers"))
@ApiReference("/help")
class App extends ExpressApp {

    // Configure Express middleware.
    protected middleware(): void {
        this.express.use(logger("dev"));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));

        this.express.all("*", this.allowHeaders);
    }

    private allowHeaders(req: Request, res: Response, next: NextFunction) {
        res.header("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, token");
        if (req.method === "OPTIONS") {
            res.send();
        } else {
            next();
        }
    }

    protected environmentSettings(): Dictionary<string> {
        return {};
    }
}

const app = new App()

app.express.use((req, res, next) => {
    next(new NotFound());
});

// 500
app.express.use((err, req: Request, res: Response, next: NextFunction) => {
    if (!(err instanceof HttpError)) {
        console.error(err);
        err = new InternalServerError();
    }
    res.statusCode = err.statusCode;
    res.jsonp(err);
});

export default app.express;
