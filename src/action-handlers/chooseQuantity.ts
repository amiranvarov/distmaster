import Keyboard, { HOME_BUTTONS } from "../lib/Keyboard";
import DB from '../db'
import * as Actions from '../actions-constants'
import User from '../lib/User'
import Basket from '../lib/Basket'
import * as _ from 'lodash'
import * as Buttons from '../common-buttons'
import * as Navigation from '../lib/Navigation'

export async function chooseQuantity ({text, from}, bot) {
    const product = await User.getProduct(from.id);
    const {payload} = await User.getAction(from.id);


    if (text === Buttons.BASKET) {
        await Navigation.basketView(from.id, Actions.CHOOSE_QUANTITY);
        return;
    }

    if (text == Buttons.BACK) {
        console.log('back 1')
        await Navigation.chooseSizeView(from.id, product);
        return;
    }


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
    const { price } = _.find(product.sizes, {size: payload.size});
    await User.addToCard(from.id,
        {
            position_id: payload.product,
            size: payload.size,
            taste: payload.taste,
            quantity,
            price,
            name: product.name
        });

    if (product.tastes && product.tastes.length > 1) {
        await User.updateAction(
            from.id,
            Actions.CHOOSE_TASTE,
            {
                product: product._id
            }
        );
        bot.sendMessage(from.id, 'Добавлено в корзину! Что еще закажем?', Keyboard.generateTaste(product.tastes));
        return;
    }

    if (product.sizes && product.sizes.length > 1) {
        await User.updateAction(
            from.id,
            Actions.CHOOSE_SIZE,
            {
                product: product._id
            }
        );
        bot.sendMessage(from.id, 'Добавлено в корзину! Что еще закажем?', Keyboard.generateSizes(product));
        return;
    }

}
