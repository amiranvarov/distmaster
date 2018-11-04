import DB from '../db'
import {ObjectID} from "bson";


interface AgentCreateInterface {
    name: string;
    phone: string;
    tg_id: string;
    region?: string;
    create_time?: Date;
}

export default class  Agent {

    static async exists ({filter}: any) {
        const count = await DB.mongo.collection('agents').count(filter);
        return count > 0
    }

    static async getOne(filter = {}) {
        return await DB.mongo.collection('agents').findOne(filter);
    }

    static async create(agent: AgentCreateInterface) {
        agent.region = 'none';
        agent.create_time = new Date();
        return await DB.mongo.collection('agents').insertOne(agent);
    }

    static async getAll (filter = {}) {
        console.log('Filter', filter)
        return await DB.mongo.collection('agents').find(filter).sort({create_time: -1}).toArray();
    }

    static async replace (documentId, update) {
        if (!documentId) {
            throw "update filter must be passed"
        }
        await DB.mongo.collection('agents').replaceOne({_id: new ObjectID(documentId)}, update);

        return await DB.mongo.collection('agents').findOne({_id: new ObjectID(documentId)});
    }
}



