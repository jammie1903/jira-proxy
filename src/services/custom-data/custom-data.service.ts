import { Service, Autowired } from "express-utils";
import { ICustomDataService } from "./i-custom-data.service";
import * as HttpErrors from "http-errors";
import fetch from "node-fetch";
import { IUserData } from "../../interfaces/i-user-data";
import { ICustomData } from "../../interfaces/i-custom-data";
import { IMongoService } from "../mongo/i-mongo.service";
import { Db, Cursor } from "mongodb";
import { DataAvailability } from "../../enums/data-availability";

@Service("customDataService")
export default class CustomDataService implements ICustomDataService {

    @Autowired()
    private mongoService: IMongoService;

    storeCustomData(userDetails: IUserData, customData: ICustomData): Promise<void> {
        return this.mongoService.run((db: Db) => {
            const query: any = {
                username: userDetails.username,
                domain: userDetails.jiraUrl,
            };
            if (typeof customData.id !== 'undefined' && customData.id !== null) {
                query._id = customData.id;
            }
            return db.collection(customData.type).replaceOne(query,
                Object.assign({
                    data: customData.data,
                    availability: customData.availability,
                }, query),
                { upsert: true })
                .then(() => { });
        });
    }

    getOwnCustomData(userDetails: IUserData, type: string, identifier?: string | number): Promise<ICustomData> {
        return this.mongoService.run((db: Db) => {
            const query: any = {
                username: userDetails.username,
                domain: userDetails.jiraUrl,
            };
            if (typeof identifier !== 'undefined' && identifier !== null) {
                query._id = identifier;
            }
            return db.collection(type).findOne(query)
                .then(item => {
                    item.id = item._id;
                    delete item._id;
                    return item;
                });
        });
    }

    getAllCustomData(userDetails: IUserData, type: string, identifier?: string | number): Promise<ICustomData[]> {
        return this.mongoService.run((db: Db) => {
            const query: any = {
                $or: [{ username: userDetails.username }, { availability: { $ne: DataAvailability.private } }],
                domain: userDetails.jiraUrl,
            };
            if (typeof identifier !== 'undefined' && identifier !== null) {
                query._id = identifier;
            }
            const result: Cursor = db.collection(type).find(query);
            return new Promise((res, rej) => {
                const returnList = [];
                result.forEach(item => {
                    if (item.username !== userDetails.username && item.availability !== DataAvailability.public) {
                        delete item.username;
                    }
                    item.id = item._id;
                    delete item._id;
                    returnList.push(item);
                }, (err) => {
                    err ? rej(err) : res(returnList);
                });
            });
        });
    }
}
