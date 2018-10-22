import {BOT, TelegramMessage} from '../lib/Messanger'
import DB from '../db'
import * as Actions from '../actions-constants'
import Keyboard from "../lib/Keyboard";

export async function requestLocation (message: TelegramMessage, bot: any) {
    if (!message.location) {
        return bot.sendMessage (message.from.id, 'Отправьте местоположние вашего магизна как Location (локейшн)')
    }

    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: message.from.id},
            {$set: {
                        'shop.location': {
                            type: 'Point',
                            coordinates: [
                                message.location.longitude,
                                message.location.latitude
                            ]
                        },
                        action: {
                            type: Actions.START
                        }
                }}
        );
    bot.sendMessage(message.from.id, 'Отлично!\n Вы зарегистрировались в нашей системе)\n\nТеперь вы можете сделать свой первый заказ, а так же смотреть статусы заказов', Keyboard.homeKeyboard())
}
