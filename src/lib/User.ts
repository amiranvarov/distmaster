import DB from '../db'
import * as Actions from "../actions-constants";
import {ObjectID} from "bson";


export default class User {

    static async updateAction (userId, action, payload = undefined) {
        const updateQuery = {
            $set: {
                'action.type': action
            }
        };
        if (payload) {
            updateQuery['$set']['action.payload'] = payload;
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
        const { action } = await DB.mongo.collection('users').findOne({tg_id: userId});
        const product = await DB.mongo.collection('positions').findOne({_id: new ObjectID(action.payload.product)});
        return product
    }

    static async addToCard (userId: string, product: {position_id: number, size?: string, taste?: string, quantity: number, price: number, name: string}) {
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
