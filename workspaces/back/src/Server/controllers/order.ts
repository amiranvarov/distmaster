import DB from '../../db'
import Order from '../../lib/Order'
import {BOT} from '../../lib/Messanger'
import {ObjectID} from 'mongodb'
import { renderProductsList} from '../../helpers'
import Keyboard from '../../lib/Keyboard'

const RECORDS_PER_PAGE = 50;

export const fetchList = async ({query: {filter, page = 1}}, res) => {
    // @ts-ignore
    page = parseInt(page);

    if (filter) {
        filter = JSON.parse(filter);
        for (let key in filter ) {
            const value = filter[key];

            if (key === 'status' && value === 'all') {
                continue;
            }
            filter[key] = new RegExp(value,"ig");
        }
    } else {
        filter = {}
    }

    if(filter.status === 'all') {
        delete filter.status;
    }

    const total = await DB.mongo.collection('orders').count(filter);

    let orders = await DB.mongo.collection('orders')
        .find(filter)
        .project({action: 0})
        .skip((page * RECORDS_PER_PAGE) - RECORDS_PER_PAGE)
        .sort({create_time: -1})
        .limit(RECORDS_PER_PAGE)
        .toArray();

    orders = await Promise.all(orders.map(async order => await Order.populateOrder(order)));

    res.json({list: orders, page, total})
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
