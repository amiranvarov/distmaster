import DB from '../db'
import * as Actions from "../actions-constants";
import {ObjectID} from "mongodb";
import Keyboard from './Keyboard'
import {renderProductsList} from '../helpers'

enum SELLER_TYPES  {
    KEY_ACCOUNT = 'key_account',
    WHOLESALER = 'wholesaler',
    SHOP = 'shop'
}


export default class Basket {

    static async getProducts (userId) {
        const { basket } = await DB.mongo.collection('users')
            .findOne(
                {tg_id: userId}
            );

        const productsInBasket = basket;
        const productIds = productsInBasket.map(product => product.position_id);

        let products = await DB.mongo.collection('positions').find({_id: {$in: productIds}}).toArray();
        products = products.map((product, index) => {
            const relatedProduct = productsInBasket.find(order => order.position_id.toString('hex') === product._id.toString('hex'));
            product.quantity = relatedProduct.quantity;
            return product
        });

        return products;
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

    static getPriceForUserType (product, userId = undefined) {
        const SELLER_TYPE = SELLER_TYPES.SHOP;
        return product.price[SELLER_TYPE];
    }

    static async sendDetails (userId, bot) {

        const products = await Basket.getProducts(userId);

        if(!products || products.length === 0) {
            return Basket.sendEmptyBasket(userId, bot);
        }

        let msg = '<b>Корзина:</b> \n\n';
        let totalPrice = 0;

        msg += renderProductsList(products, 'shop');

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
