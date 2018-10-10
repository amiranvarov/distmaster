import Keyboard, { HOME_BUTTONS } from "../lib/Keyboard";
import DB from '../db'
import * as Actions from '../actions-constants'
import User from '../lib/User'

export async function chooseTaste ({text, from}, bot) {
    const product = await User.getProduct(from.id);
    const action = await User.getAction(from.id);

    if (product.tastes.indexOf(text) == -1 ) {
        bot.sendMessage(from.id, 'Такого вкуса нету. Выберите из списка');
        return;
    }

    await User.updateAction(
        from.id,
        Actions.CHOOSE_QUANTITY,
        {
            ...action.payload,
            taste: text
        }
    );
    bot.sendMessage(from.id, 'Выберите или введите количество:', Keyboard.generateQuantity());

}
