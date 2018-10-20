import DB from '../db'

export default class  Products {

    static async getOne (filter = {}) {
        return await DB.mongo.collection('positions').findOne(filter);
    }

    static async getNames () {
        return await DB.mongo.collection('positions').distinct('name');
    }

    static async getSizes (filter = {}) {
        return await DB.mongo.collection('positions').distinct('size', filter);
    }

    static async getFlavors (filter = {}) {
        return await DB.mongo.collection('positions').distinct('flavor', filter);
    }
}


