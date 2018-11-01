import DB from '../db'
import {ObjectID} from "bson";


interface IClient {
    name: string;
    phone: string;
    shop: {
        name: string;
        legal_name: string;
        location_text: string;
        location: any;

    };
    tg_id: string;
    _id: ObjectID
}
export enum CLIENT_STATUS {
    REVIEW = 'review',
    APPROVE = 'approve',
    REJECT = 'reject'
}


export default class Client {

    static async getAll (filter = {}) {
        return await DB.mongo.collection('users').find(filter).sort({create_time: -1}).toArray();
    }

    static async getOne (filter) {
        if (!filter) {
            return null;
        }
        return await DB.mongo.collection('users').findOne(filter);
    }

    static async replace (documentId, update) {
        if (!documentId) {
            throw "update filter must be passed"
        }
        await DB.mongo.collection('users').replaceOne({_id: new ObjectID(documentId)}, update);

        return await DB.mongo.collection('users').findOne({_id: new ObjectID(documentId)});
    }


}
