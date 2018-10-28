import DB from '../../db'
import Order from '../../lib/Order'
import {BOT} from '../../lib/Messanger'
import {ObjectID} from 'mongodb'
import { renderProductsList} from '../../helpers'
import Keyboard from '../../lib/Keyboard'

const registeredUser = {
    login: 'admin',
    password: 'admin'
}

export const fetchList = async (req, res) => {
    const page = req.body.page || 1;

    const orders = await Order.getAll();

    res.json({list: orders, current: 1})
};

export const approve = async (req, res) => {
    const {orderId} = req.params;
    const {deliveryDate} = req.body;

    if (!orderId || !deliveryDate) {
        return res.sendStatus(400);
    }

    await DB.mongo.collection('orders').updateOne(
        {_id: new ObjectID(orderId)},
        {
            $set: {
                status: 'approve',
                delivery_date: deliveryDate
            }
        }
    );

    const order = await Order.getOne(orderId);


    // генерируем сообщение
    let msg = '' +
        'Хэй!\n' +
        `Ваш заказ одобрен, будет доставлен в ${deliveryDate}\n` +
        '' +
        'Детали заказа:\n' +
        renderProductsList(order.products, 'shop');

    BOT.sendMessage(order.user_id, msg, {"parse_mode": "html"})
    res.sendStatus(200)
}

export const reject = async (req, res) => {
    const {orderId} = req.params;
    const {reason} = req.body;

    if (!orderId || !reason) {
        return res.sendStatus(400);
    }

    console.log('REJECT', orderId, reason)

    await DB.mongo.collection('orders').updateOne(
        {_id: new ObjectID(orderId)},
        {
            $set: {
                status: 'reject',
                reason
            }
        }
    );

    const order = await Order.getOne(orderId);


    // генерируем сообщение
    let msg = '' +
        'Хэй!\n' +
        `К сожалнию ваш заказ был отклонен\n` +
        'Причина отказа: \n' +
        `${reason}\n\n` +
        'Детали заказа:\n' +
        renderProductsList(order.products, 'shop');

    BOT.sendMessage(order.user_id, msg, {"parse_mode": "html"})
    res.sendStatus(200)
}