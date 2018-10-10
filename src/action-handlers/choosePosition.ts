import Keyboard, { HOME_BUTTONS } from "../lib/Keyboard";
import DB from '../db'
import * as Actions from '../actions-constants'
import User from '../lib/User'
import * as Navigation from '../lib/Navigation';
import * as Buttons from '../common-buttons'

export async function choosePosition ({text, from}, bot) {

    if(text === Buttons.BASKET) {
        await Navigation.basketView(from.id, Actions.CHOOSE_POSITION);
        return
    }

    if(text === Buttons.BACK) {
        await Navigation.homeView(from.id);
        return
    }

    const product = await DB.mongo.collection('positions').findOne({'name': text});

    if(!product) {
        bot.sendMessage(from.id, 'Такой позиции нету')
        return
    }

    if (product.sizes.length > 1 ) {
        await Navigation.chooseSizeView(from.id, product);
        return;
    }

    await Navigation.chooseQuantityView(from.id, {
        product: product._id
    });
}
