import DB from '../db'
import * as moment from 'moment';
import Basket from './Basket'


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
export enum PAYMENT_TYPE {
    CASH = 'cash',
    Transfer = 'transfer'
}

interface IOrderCreate {
    userId: string,
    products: any;
    paymentMethod: string
}

export default class Order {

    static async create ({userId, products, paymentMethod}: IOrderCreate) {
        products = products.map(product => {
            return {
                position_id: product._id,
                quantity: product.quantity
            }
        });

        const order = {
            status: ORDER_STATUS.REVIEW,
            crate_time: moment().unix(),
            products,
            user_id: userId,
            payment_type: paymentMethod,
        };

        await DB.mongo.collection('orders').insertOne(order);
    }

    static async getAll (userId) {
        const orders = await DB.mongo.collection('orders').find({user_id: userId}).toArray();

        return await Promise.all(orders.map(async order => await Order.getOrder(order)));
    }

    static async getOrder (order) {
        const productsInOrder = order.products;

        const productIds = productsInOrder.map(product => product.position_id);

        let productsFromDB = await DB.mongo.collection('positions').find({_id: {$in: productIds}}).toArray();

        productsFromDB = productsFromDB.map((productFromDB, index) => {
            const matchedProduct = productsInOrder.find(productInOrder => productInOrder.position_id.toString('hex') === productFromDB._id.toString('hex'));
            productFromDB.quantity = matchedProduct.quantity;
            return productFromDB
        });

        order.products = productsFromDB;
        return order;
    }
}
