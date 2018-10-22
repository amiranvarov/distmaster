const BOT_NAME = 'GETPACK'
import DB from '../db'
import Keyboard from '../lib/Keyboard'

export default class Help {
    async handle(message, bot) {

        console.log(message)
        if(await this.userExists(message.from)) {
            return bot.sendMessage(
                message.from,
                'Привет я бот службы доставки! Закажем вам чего то?',
                Keyboard.homeKeyboard()
            )
        }

        return bot.sendMessage(message.from,
            `Привет! Я бот ${BOT_NAME} помогаю пользователям быстро и `
            +`просто заказать доставку товаров от дистрибютора и следить за их статусом. \n`
            +`Для начала вам нужно зарегистрироватся в системе. Для этого нажмите на команду /register ниже\n`
            +`\n`
            +`/register - регистрация в системе ${BOT_NAME}`
        );
    }


    async userExists (telegramUserId) {
        const count = await DB.mongo.collection('users').count({tg_id: telegramUserId});
        return (count > 0)
    }

}
