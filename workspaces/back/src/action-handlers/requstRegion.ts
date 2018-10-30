import {TelegramMessage}  from '../lib/Messanger'
import DB from '../db'
import * as Actions from '../actions-constants'
import Keyboard from '../lib/Keyboard'


export enum RegionsEnum {
    AHANGARAN = 'Ахангаран',
    ALMALIQ = 'Алмалык',
    ANGREN = 'Ангрен',
    PISKENT = 'Пискент',
    BUKA = 'Бука',
    NURAFSHAN = 'Нурафшан (Туйтепа)'
}
export const RegionsArray = [
    RegionsEnum.AHANGARAN,
    RegionsEnum.ALMALIQ,
    RegionsEnum.ANGREN,
    RegionsEnum.PISKENT,
    RegionsEnum.BUKA,
    RegionsEnum.NURAFSHAN,
];

export async function requestRegion (message: TelegramMessage, bot: any) {


    // @ts-ignore
    const validRegion = (RegionsArray.indexOf(message.text) > -1);
    if (!validRegion) {
        return await bot.sendMessage(message.from.id, 'Выберите регион из списка ниже');

    }

    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: message.from.id},
            {$set: {
                    'shop.region': message.text,
                    action: {
                        type: Actions.REQUEST_LOCATION_TEXT
                    }
                }}
        );
    await bot.sendMessage(message.from.id, 'Введите адрес вашего магазина. \nНапример: Ташкенская область, Ангрен, улица Ширин, 12й дом', Keyboard.empty());
}
