import DB from '../db'
import * as Actions from "../actions-constants";
import {ObjectID} from "bson";
import Keyboard from '../lib/Keyboard'


export default class Basket {

    static async getProducts (userId) {
        const { basket } = await DB.mongo.collection('users')
            .findOne(
                {tg_id: userId}
            );
        return basket;
    }

    static async sendTip (userId, bot) {
        const msg = '«❌ <b>Наименование</b>» - удалить одну позицию\n' +
            '«🔄 <b>Очистить</b>» - полная очистка корзины';
        await bot.sendMessage(userId, msg, {parse_mode: 'HTML'});
    }

    static async sendDetails (userId, bot) {
        const orders = await Basket.getProducts(userId);
        let msg = '<b>Корзина:</b> \n\n';
        let totalPrice = 0;

        orders.map((order, index) => {
            msg += `<b>№${index + 1} ${order.name}</b> ${order.size} ${order.taste} \n`;
            msg += `${order.quantity.toLocaleString()} * ${order.price.toLocaleString()} = ${ (order.quantity * order.price).toLocaleString()}\n`;
            totalPrice += (order.quantity * order.price);
        });

        msg += `\n\n <b>Итого</b>: ${totalPrice.toLocaleString()}`;

        bot.sendMessage(userId, msg, await Keyboard.generateBasket(orders))
    }

    static async sendMessage (userId, bot) {
        await Basket.sendTip(userId, bot);
        await Basket.sendDetails(userId, bot);
    }

    static async sendEmptyBasket (userId, bot) {
        bot.sendMessage(userId, 'Ваша корзина пуста, выберите что-нибудь для заказа', Keyboard.emptyBasket());
    }
}
