import DB from '../db'
import * as moment from 'moment';
import Basket from './Basket'
import User from './User'
import {ObjectID} from "bson";


interface IOrder {
    position_id: string;
    size: string;
    taste: string;
    quantity: number;
    price: number;
}
export enum ORDER_STATUS {
    REVIEW = 'review',
    APPROVE = 'approve',
    REJECT = 'reject'
}
export enum PAYMENT_TYPE {
    CASH = 'cash',
    Transfer = 'transfer'
}

interface IOrderCreate {
    userId: string,
    products: any;
    paymentMethod: string,
    orderNumber?: string
}

export default class Order {

    static async create ({userId, products, paymentMethod, orderNumber}: IOrderCreate) {
        products = products.map(product => {
            return {
                position_id: product._id,
                quantity: product.quantity
            }
        });

        const order :any = {
            status: ORDER_STATUS.REVIEW,
            create_time: moment().unix(),
            products,
            user_id: userId,
            payment_type: paymentMethod,
        };

        if(orderNumber) {
            order.order_number = orderNumber
        }

        await DB.mongo.collection('orders').insertOne(order);
    }

    static async getAll (filter = {}) {
        const orders = await DB.mongo.collection('orders').find(filter).sort({create_time: -1}).toArray();

        return await Promise.all(orders.map(async order => await Order.populateOrder(order)));
    }

    static async getOne (orderId: string) {
        const order = await DB.mongo.collection('orders').findOne({_id: new ObjectID(orderId)});
        return await Order.populateOrder(order)
    }

    static async populateOrder (order) {

        const productsInOrder = order.products;

        const productIds = productsInOrder.map(product => product.position_id);

        let productsFromDB = await DB.mongo.collection('positions').find({_id: {$in: productIds}}).toArray();

        productsFromDB = productsFromDB.map((productFromDB, index) => {
            const matchedProduct = productsInOrder.find(productInOrder => productInOrder.position_id.toString('hex') === productFromDB._id.toString('hex'));
            productFromDB.quantity = matchedProduct.quantity;
            return productFromDB
        });

        // вытаскивам данные пользвателя
        order.user = await User.findOne({tg_id: order.user_id});

        order.products = productsFromDB;
        return order;
    }
}
