import DB from '../db'
import * as Actions from "../actions-constants";
import {ObjectID} from "bson";


export default class User {

    static async findOne  (filter = {}) {
        return  await DB.mongo.collection('users')
            .findOne(filter,
                {
                    fields:
                        {name: 1, phone: 1, shop: 1, tg_id: 1}});
    }

    static async userExists (userId: number | string): Promise<boolean> {
        const count = await DB.mongo.collection('users').count({tg_id: userId, phone: {$exists: true}});
        return count > 0
    }

    static async updateAction (userId, action, payload = undefined) {
        const updateQuery = {
            $set: {
                'action.type': action
            }
        };
        if (payload) {
            for (let key in payload) {
                updateQuery['$set'][`action.payload.${key}`] = payload[key];
            }
        }

        await DB.mongo.collection('users')
            .updateOne(
                {tg_id: userId},
                updateQuery
            );
    }

    static async savePrevAction (userId, action) {
        await DB.mongo.collection('users')
            .updateOne(
                {tg_id: userId},
                {
                    $set: {
                        prev_action: action
                    }
                }
            );
    }

    static async getPrevAction (userId) {
        const { prev_action } = await DB.mongo.collection('users').findOne({tg_id: userId});
        return prev_action;
    }

    static goBack (userId) {

    }

    static async getAction (userId) {
        const { action } = await DB.mongo.collection('users').findOne({tg_id: userId});
        return action;
    }

    static async getProduct (userId) {
        const { action: {payload} } = await DB.mongo.collection('users').findOne({tg_id: userId});
        const filter: any = {};

        if (payload.product_id) {
            filter._id = new ObjectID(payload.product_id)
        } else if (payload.name) {
            filter.name = payload.name;
        } else if (payload.size) {
            filter.size = payload.size;
        }

        return await DB.mongo.collection('positions').findOne(filter);
    }

    static async addToCard (userId: string, product: {position_id: number, quantity: number}) {
        await DB.mongo.collection('users').updateOne(
            {tg_id: userId},
            {
                $addToSet: {
                    basket: product
                }
            }
            );
    }
}
