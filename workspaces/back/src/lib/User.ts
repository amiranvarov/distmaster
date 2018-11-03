import DB from '../db'
import * as Actions from "../actions-constants";
import {ObjectID} from "bson";
import * as moment from 'moment'


export default class User {

    static async findOne  (filter = {}) {
        return  await DB.mongo.collection('users')
            .findOne(filter,
                {
                    fields:
                        {action: 0}});
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

    static getContractDetails (user) {
        const createMoment = moment(user.create_time);
        return {
            number: user.shop.contract_number,
            date: {
                day: createMoment.format('DD'),
                month: createMoment.format('MMMM'),
                year: createMoment.format('YYYY')
            }
        }
    }

    static getNextOrderNumber (user) {
        const createMoment = moment();
        const nextNumber = (user.last_order_number + 1);
        return {
            number: nextNumber,
            date: {
                day: createMoment.format('DD'),
                month: createMoment.format('MMMM'),
                year: createMoment.format('YYYY')
            }
        }
    }

    static increment
}
