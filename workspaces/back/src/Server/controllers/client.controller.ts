import DB from '../../db'
import Order from '../../lib/Order'
import Client from '../../Model/client.model'
import {BOT} from '../../lib/Messanger'
import {ObjectID} from 'mongodb'
import { renderProductsList} from '../../helpers'
import Keyboard from '../../lib/Keyboard'
import * as _ from 'lodash'

const RECORDS_PER_PAGE = 50;

export const fetchList = async ({query: {filter, page = 1}}, res) => {



    if (filter) {
        filter = JSON.parse(filter);
        for (let key in filter ) {
            const value = filter[key];
            filter[key] = new RegExp(value,"ig");
        }
    } else {
        filter = {}
    }

    const total = await DB.mongo.collection('users').count(filter);

    let clients = await DB.mongo.collection('users')
        .find(filter)
        .project({action: 0})
        .skip((page * RECORDS_PER_PAGE) - RECORDS_PER_PAGE)
        .sort({create_time: -1})
        .limit(RECORDS_PER_PAGE)
        .toArray();

    clients = clients.map(client => {
        if (client.shop && client.shop.location) {
            client.shop.location.coordinates.reverse()
        }
        return client;
     })

    res.json({list: clients, page, total})
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

export const update = async (req, res) => {
    const { clientId } = req.params;
    const client = req.body;

    delete client._id;

    if (!clientId || !clientId) {
        return res.sendStatus(400);
    }

    const clientInDB = await Client.getOne({_id: new ObjectID(clientId)});
    const merged = _.merge(clientInDB, client);
    const updatedDocument = await Client.replace(clientInDB._id, merged);
    res.json(updatedDocument);
};
