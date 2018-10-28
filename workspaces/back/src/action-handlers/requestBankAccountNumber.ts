import {BOT, TelegramMessage} from '../lib/Messanger'
import DB from '../db'
import * as Actions from '../actions-constants'
import Keyboard from "../lib/Keyboard";

export async function requestBankAccountNumber (message: TelegramMessage, bot: any) {

    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: message.from.id},
            {$set: {
                    'shop.bank_account_number': message.text,
                    action: {
                        type: Actions.REQUEST_MFO,
                    }
                }}
        );
    // bot.sendMessage(message.from.id, 'Отлично!\n Вы зарегистрировались в нашей системе)\n\nТеперь вы можете сделать свой первый заказ, а так же смотреть статусы заказов', Keyboard.homeKeyboard())
    bot.sendMessage(message.from.id, 'Введите <b>МФО</b>', Keyboard.empty())
}
