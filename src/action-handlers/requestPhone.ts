import {TelegramMessage}  from '../lib/Messanger'
import DB from '../db'
import * as Actions from '../actions-constants'
import Keyboard from '../lib/Keyboard'

export async function requestPhone (message: TelegramMessage, bot: any) {
    if (!message.contact) {
        return bot.sendMessage (message.from.id, 'Нажмите на кнопку ниже "Предоставить мой номер телефона"')
    }

    if(message.contact.user_id !== message.from.id) {
        return bot.sendMessage (message.from.id, 'Нажмите на кнопку ниже "Предоставить мой номер телефона"')
    }

    const {
        first_name,
        last_name,
        phone_number,
    } = message.contact;
    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: message.from.id},
            {$set: {
                    name: `${first_name} ${last_name}`,
                    phone: phone_number,
                    action: {
                        type: Actions.REQUEST_LOCATION
                    }
                }}
            );
    await bot.sendMessage(message.from.id, 'Отлично! А теперь отправьте местолопожение вашего магазина', Keyboard.requestLocation());
}
