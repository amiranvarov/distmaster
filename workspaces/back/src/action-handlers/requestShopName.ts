import {TelegramMessage}  from '../lib/Messanger'
import DB from '../db'
import * as Actions from '../actions-constants'
import Keyboard from '../lib/Keyboard'

export async function requestShopname (message: TelegramMessage, bot: any) {

    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: message.from.id},
            {$set: {
                    shop: {
                        name: message.text
                    },
                    action: {
                        type: Actions.REQUEST_LEGAL_NAME
                    }
                }}
        );
    await bot.sendMessage(message.from.id, 'Отлично! А теперь введите вашего Юридическое название. Например: MCHJ "MUSLIMA BIZNES"', Keyboard.empty());
}
