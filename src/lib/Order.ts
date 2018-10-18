import DB from '../db'
import * as moment from 'moment';


interface IOrder {
    position_id: string;
    size: string;
    taste: string;
    quantity: number;
    price: number;
}
export enum ORDER_STATUS {
    REVIEW = 'review',
    SENT = 'sent'
}
export default class Order {

    static async create (userId, products) {
        let totalAmount = 0;
        products = products.map(product => {
            totalAmount += product.quantity * product.price;
            return {
                position_id: product.position_id,
                size: product.size,
                taste: product.taste || undefined,
                quantity: product.quantity,
            }
        });

        const order = {
            status: ORDER_STATUS.REVIEW,
            crate_time: moment().unix(),
            products,
            amount: totalAmount,
            user_id: userId
        };
        await DB.mongo.collection('orders').insertOne(order);
    }

    static async getAll (userId) {
        return await DB.mongo.collection('orders').find({user_id: userId}).toArray();
    }
}
