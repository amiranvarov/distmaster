import DB from '../db'

interface MessageSender {
    id: number;
    first_name: string
    last_name: string
    username: string
    type: string
}

interface Contact {
    phone_number: string;
    first_name: string;
    last_name: string;
    user_id: number;
}

interface ContactMessage {
    message_id: number;
    from: MessageSender;
    date: number;
    contact: Contact
}

interface TelegramLocation {
    latitude: number;
    longitude: number

}

export default class Auth {
    handle(message, bot) {
        const option = {
            "parse_mode": "Markdown",
            "reply_markup": {
                "one_time_keyboard": true,
                "keyboard": [[{
                    text: "Предоставить мой номер телефона",
                    request_contact: true
                }], ["Отмена"]]
            }
        };
        return bot.sendMessage(message.from,
            'Начинаем регистрацию! Сначала предоставьте нам ваш номер нажав на кнопку', option);
    }

    async handleContact (messageWithContact: ContactMessage, bot) {
        if (!this.isContactOwner(messageWithContact)) {
            return bot.sendMessage(messageWithContact.from,
                'Нелья отправить чужой номер, вы должны отправить свой');
        }
        const { contact: {first_name, last_name, phone_number, user_id}} = messageWithContact;

        if( await this.userExists(user_id)) {
            console.log('user exists')
            return;
        }

        await DB.mongo.collection('users').insertOne({
            name: `${first_name} ${last_name}`,
            phone: phone_number,
            tg_id: user_id,
        });

        const option = {
            "parse_mode": "Markdown",
            "reply_markup": {
                "one_time_keyboard": true,
                "keyboard": [[{
                    text: "Отправить моё текущее местоположение",
                    request_location: true
                }], ["Отмена"]]
            }
        };
        // create user
        bot.sendMessage(
            messageWithContact.from.id,
            'Отлично! А теперь предоставьте ваше текущее местоположение ' +
            'что бы мы знали куда доставлять заказанные вами товары',
            option
        )
    }

    isContactOwner (messageWithContact: ContactMessage) {
        const {from, contact} = messageWithContact
        return (from.id === contact.user_id)
    }

    async handleLocation ({from, location} , bot) {
        await DB.mongo.collection('users').updateOne(
            {
                tg_id: from.id
            },
            {
                $set: {
                    store_location: {
                        type: "point",
                        coordinates: [
                            location.longitude,
                            location.latitude
                        ]
                    }
                }
            }
        );
        const options = {
            "parse_mode": "Markdown",
            "reply_markup": null
        }
        bot.sendMessage(
            from.id,
            'Вы успешно зарегистрировались в нашей системе! \n' +
            'Управлять вашими заказами, Вы можете через следующие команды',
            options
        )
    }

    async userExists (telegramUserId) {
        const count = await DB.mongo.collection('users').count({tg_id: telegramUserId});
        return (count > 0)
    }
}
