import { MongoClient } from 'mongodb';


export default class DB {
    static mongo;

    static async init () {
        const client = await MongoClient.connect('mongodb://localhost:27017');
        DB.mongo = client.db('dist-bot');
        console.log('MongoDB connected')
    }
}
