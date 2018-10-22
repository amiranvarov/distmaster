import Keyboard, { HOME_BUTTONS } from "../lib/Keyboard";
import DB from '../db'
import * as Actions from '../actions-constants'
import User from '../lib/User'
import * as Buttons from '../common-buttons'
import Basket from '../lib/Basket'
import * as Navigation from '../lib/Navigation'

export async function basket ({text, from}, bot) {

    switch (text) {
        case Buttons.BACK:
            const prevAction = await User.getPrevAction(from.id);
            await Navigation.generateFromAction(prevAction, from.id);
            return;
        case Buttons.CLEAR_BASKET:
            await DB.mongo.collection('users').updateOne(
                {tg_id: from.id},
                {
                    $set: {
                        basket: []
                    }
                }
                );
            await Basket.sendEmptyBasket(from.id, bot);
            return;

        case Buttons.CHECKOUT:
            await Navigation.checkout(from.id);
            return;

    }

    if (text[0] === '❌') {
        // TODO: Перед удалением товара проверить есть ли такой в баскете или уже удален
        const parts = text.split(' ');
        const productIndexAsStr = parts[1]; // №1
        const extractedNumber = productIndexAsStr.substr(1);
        const indexInBasket = parseInt(extractedNumber) - 1;
        const key = `basket.${indexInBasket}`;
        await DB.mongo.collection('users').updateOne(
            {tg_id: from.id},
            {
                $set: {
                    [key] : null
                }
            });
        await DB.mongo.collection('users').updateOne(
            {tg_id: from.id},
            {
                $pull: {
                    "basket": null
                }
            });

        if ((await Basket.getProducts(from.id)).length === 0) {
            await Basket.sendEmptyBasket(from.id, bot)
            return
        }
        await Basket.sendMessage(from.id, bot);
    }
}
