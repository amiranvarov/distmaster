import Keyboard, { HOME_BUTTONS } from "../lib/Keyboard";
import DB from '../db'
import * as Actions from '../actions-constants'
import User from '../lib/User'
import {ObjectID} from "bson";
import * as _ from 'lodash'
import * as Navigation from '../lib/Navigation'
import * as Buttons from "../common-buttons";

export async function chooseSize ({text, from}, bot) {

    if(text === Buttons.BASKET) {
        await Navigation.basketView(from.id, Actions.CHOOSE_SIZE);
        return
    }

    if(text === Buttons.BACK) {
        await Navigation.choosePositionsView(from.id);
        return
    }


    const { action } = await DB.mongo.collection('users').findOne({tg_id: from.id});
    const product = await DB.mongo.collection('positions').findOne({_id: new ObjectID(action.payload.product)});

    if(!_.find(product.sizes, {size: text}) ) {
        bot.sendMessage(from.id, 'Такого размера нету, выберите из меню')
        return
    }

    if(product.tastes && product.tastes.length > 1) {
        await Navigation.chooseTasteView(from.id, {text, product});
        return;
    }

    await Navigation.chooseQuantityView(from.id, {
        product: product._id,
        size: text
    });
}
