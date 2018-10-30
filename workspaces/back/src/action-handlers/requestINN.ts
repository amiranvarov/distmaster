import {BOT, TelegramMessage} from '../lib/Messanger'
import DB from '../db'
import * as Actions from '../actions-constants'
import Keyboard from "../lib/Keyboard";

export async function requestINN (message: TelegramMessage, bot: any) {

    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: message.from.id},
            {$set: {
                    'shop.inn': message.text,
                    action: {
                        type: Actions.REQUEST_CONTRACT_NUMBER,
                    }
                }}
        );
    bot.sendMessage(message.from.id, 'Введите <b>номер договора</b>', Keyboard.empty())
}
