import { MongoClient } from 'mongodb';


export default class DB {
    static mongo;

    static async init () {
        const client = await MongoClient.connect('mongodb://localhost:27017');
        DB.mongo = client.db('dist-bot');
        console.log('MongoDB connected')
    }

    static async getNextSequenceValue(sequenceName){

        const sequenceDocument = await DB.mongo.collection('counters').findOneAndUpdate(
            { _id: sequenceName },
            { $inc: {sequence_value:1 }},
            { returnNewDocument: true }
        );
        if(!sequenceDocument) {
            return;
        }
        const id = sequenceDocument.value.sequence_value;
        console.log('ID!!!', id);
        return id;
    }
}
