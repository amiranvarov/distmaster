import {TelegramMessage}  from '../lib/Messanger'
import DB from '../db'
import * as Actions from '../actions-constants'
import Keyboard from '../lib/Keyboard'

export async function requestLocationText (message: TelegramMessage, bot: any) {

    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: message.from.id},
            {$set: {
                    'shop.location_text': message.text,
                    action: {
                        type: Actions.REQUEST_LOCATION
                    }
                }}
        );
    await bot.sendMessage(message.from.id, 'Отправьте местополоэение вашего магазина как локейшн или нажмите на кнопку ниже, что бы отправить ваше текущее местоположение', Keyboard.requestLocation());
}
