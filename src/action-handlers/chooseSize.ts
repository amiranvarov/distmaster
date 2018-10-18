import Keyboard, { HOME_BUTTONS } from "../lib/Keyboard";
import DB from '../db'
import * as Actions from '../actions-constants'
import User from '../lib/User'
import Position from '../Model/Position'
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

    const chosenProduct = await User.getProduct(from.id);
    const sizeExists = await Position.getOne({name: chosenProduct.name, size: text});
    if(!sizeExists) {
        return await bot.sendMessage(from.id, 'Такого размера нету, выберите из меню')
    }

    const productFlavors = await Position.getFlavors({name: chosenProduct.name, size: text});
    if(productFlavors && productFlavors.length > 1) {
        return await Navigation.chooseFlavorView(from.id, {text, selectedSize: text, flavors: productFlavors});
    }

    await Navigation.chooseQuantityView({
        userId: from.id,
        selectedSize: text,
        productName: chosenProduct.name
    });
}
