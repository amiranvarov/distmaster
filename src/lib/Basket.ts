import DB from '../db'
import * as Actions from "../actions-constants";
import {ObjectID} from "mongodb";
import Keyboard from '../lib/Keyboard'

enum SELLER_TYPES  {
    KEY_ACCOUNT = 'key_Account',
    WHOLESALER = 'wholesaler',
    SHOP = 'shop'
}


export default class Basket {

    static async getProducts (userId) {
        const { basket } = await DB.mongo.collection('users')
            .findOne(
                {tg_id: userId}
            );
        return basket;
    }


    static async sendMessage (userId, bot) {
        await Basket.sendTip(userId, bot);
        await Basket.sendDetails(userId, bot);
    }

    static async sendTip (userId, bot) {
        const msg = '«❌ <b>Наименование</b>» - удалить одну позицию\n' +
            '«🔄 <b>Очистить</b>» - полная очистка корзины';
        await bot.sendMessage(userId, msg, {parse_mode: 'HTML'});
    }

    static async sendDetails (userId, bot) {
        // TODO: дсотать тип аканута: key_Account or wholeaser ???
        const SELLER_TYPE = SELLER_TYPES.SHOP;

        const orders = await Basket.getProducts(userId);
        const orderIds = orders.map(order => order.position_id);

        let products = await DB.mongo.collection('positions').find({_id: {$in: orderIds}}).toArray();
        products = products.map((product, index) => {
            const relatedProduct = orders.find(order => order.position_id.toString('hex') === product._id.toString('hex'));
            product.quantity = relatedProduct.quantity;
            return product
        });

        if(!products || products.length === 0) {
            return Basket.sendEmptyBasket(userId, bot);
        }

        let msg = '<b>Корзина:</b> \n\n';
        let totalPrice = 0;

        products.map((product, index) => {
            const price = product.price[SELLER_TYPE];
            const { quantity, size, name, flavor, pack } = product;
            if (index === 0){
                msg += '---------------------\n';
            }
            msg += `<b>№${index + 1} ${name}</b> ${size} ${flavor || ''} \n`;
            msg += `${quantity.toLocaleString()} * ${pack} * ${price.toLocaleString()} = ${ (quantity * pack *  price).toLocaleString()}\n`;
            totalPrice += (quantity * pack *  price);

            msg += '---------------------\n';
        });

        msg += `\n<b>Итого</b>: ${totalPrice.toLocaleString()}`;

        bot.sendMessage(userId, msg, await Keyboard.generateBasket(products))
    }

    static async sendEmptyBasket (userId, bot) {
        bot.sendMessage(userId, 'Ваша корзина пуста, выберите что-нибудь для заказа', Keyboard.emptyBasket());
    }

    static async clearBasket (userId) {
        await DB.mongo.collection('users').updateOne(
            {tg_id: userId},
            {
                $set: {
                    basket: []
                }
            }
        );
    }


}
