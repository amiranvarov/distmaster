import Keyboard, { HOME_BUTTONS } from "../lib/Keyboard";
import DB from '../db'
import * as Actions from '../actions-constants'
import User from '../lib/User'
import Position from '../Model/Position'
import Basket from '../lib/Basket'
import * as _ from 'lodash'
import * as Buttons from '../common-buttons'
import * as Navigation from '../lib/Navigation'

export async function chooseQuantity ({text, from}, bot) {
    const product = await User.getProduct(from.id);
    // const {payload} = await User.getAction(from.id);


    if (text === Buttons.BASKET) {
        return await Navigation.basketView(from.id, Actions.CHOOSE_QUANTITY);
    }

    if (text == Buttons.BACK) {
        return await Navigation.chooseSizeView({userId: from.id});
    }

    // извлекаем цифры до скобки
    if (text.indexOf('(') !== -1) {
        text = text.substr(0, text.indexOf('('));
    }

    text = parseInt(text);


    if(!/^\d+$/.test(text)) {
        bot.sendMessage(from.id, 'Только цифры');
        return
    }
    const quantity = parseInt(text);

    if (quantity < 1) {
        bot.sendMessage(from.id, 'Невалидное количетсво');
        return
    }

    // добавить в корзину
    await User.addToCard(from.id,
        {
            position_id: product._id,
            quantity
        });

    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: from.id},
            {
                $set: {
                    action: {
                        type:   Actions.CHOOSE_POSITION,
                        payload: {}
                    }
                }
            }
        );


    bot.sendMessage(from.id, 'Добавлено в корзину! Что еще закажем?', await Keyboard.generatePositions(await Position.getNames()));
    return;
}
