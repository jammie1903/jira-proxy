import { Service } from "express-utils";
import { IMongoService } from "./i-mongo.service";
import { MongoClient, MongoError, Db } from "mongodb";

const username = "jira-proxy-api"
const password = process.env.MONGO_DB_PASSWORD;
// Connection URL
const url = `mongodb+srv://${username}:${password}@jira-data-ylhxg.mongodb.net/test?retryWrites=true`

@Service("mongoService")
export default class MongoService implements IMongoService {
    public run<T>(fn: (db: Db) => T | Promise<T>): Promise<T> {
        return new Promise<T>((res, rej) => {
            MongoClient.connect(url, (err: MongoError, db: MongoClient) => {
                if (err) {
                    rej(err);
                }
                try {
                    res(fn(db.db("jira-data")));
                } catch (e) {
                    rej(e);
                } finally {
                    db.close();
                }
            });
        });
    }
}