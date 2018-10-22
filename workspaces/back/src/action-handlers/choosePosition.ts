import Keyboard, { HOME_BUTTONS } from "../lib/Keyboard";
import DB from '../db'
import * as Actions from '../actions-constants'
import User from '../lib/User'
import Position from '../Model/Position'
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

    const product = await Position.getOne({name: text});
    if(!product) {
        bot.sendMessage(from.id, 'Такой позиции нету');
        return
    }

    const sizes = await Position.getSizes({name: text});
    if (sizes.length > 0 ) {
        return await Navigation.chooseSizeView({userId: from.id, name: text});
    }
}
