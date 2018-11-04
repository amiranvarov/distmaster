import DB from '../../db'
import Order from '../../lib/Order'
import Agent from '../../Model/Agent'
import {BOT} from '../../lib/Messanger'
import {ObjectID} from 'mongodb'
import { renderProductsList} from '../../helpers'
import * as _ from 'lodash'
import { bot as AgentBot} from '../../agent-bot'


export const fetchList = async (req, res) => {

    const agents = await DB.mongo.collection('agents').find()
        .toArray();

    res.json({list: agents})
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
    const { agentId } = req.params;
    const agent = req.body;

    if(!agent.region || !agentId) {
        return res.sendStatus(400);
    }
    delete agent._id;

    const agentInDB = await Agent.getOne({_id: new ObjectID(agentId)});
    const merged = _.merge(agentInDB, agent);
    const updatedDocument = await Agent.replace(agentInDB._id, merged);
    if(updatedDocument.region !== 'none') {
        await AgentBot.telegram.sendMessage(agentInDB.tg_id, `Вам был задан регион: ${updatedDocument.region}`)
    }
    res.json(updatedDocument);
};
