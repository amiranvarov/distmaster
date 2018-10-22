import {TelegramMessage}  from '../lib/Messanger'
import DB from '../db'
import * as Actions from '../actions-constants'
import Keyboard from '../lib/Keyboard'
import { RegionsArray } from './requstRegion'

export async function requestLegalName (message: TelegramMessage, bot: any) {

    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: message.from.id},
            {$set: {
                    'shop.legal_name': message.text,
                    action: {
                        type: Actions.REQUEST_REGION
                    }
                }}
        );
    await bot.sendMessage(message.from.id, 'Выберите регион в котором находитесь', Keyboard.regions(RegionsArray));
}
