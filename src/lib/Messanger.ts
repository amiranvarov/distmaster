import * as TelegramBot from 'node-telegram-bot-api'
import DB from '../db'
import {ObjectID} from 'mongodb'
import Keyboard from './Keyboard'
// import Message from './Message'
import BotWrapper from './BotWrapper'
import HandlerRouter from "../command"
import AuthCommandCtrl from '../command/Auth'
import * as Actions from '../actions-constants'
import * as Handlers from '../action-handlers'

export let BOT = undefined;
export function getBot() {
    return BOT;
}

const TELEGRAM_TOKEN = '651163097:AAG5lmkRUX84LLn1NeuI7qLXVF71DP93wmo';

interface TelegramUser {
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

interface TelegramLocation {
    latitude: number;
    longitude: number
}

interface TelegramMessage {
    message_id: number;
    from: TelegramUser;
    date: number;
    contact?: Contact;
    location?: TelegramLocation;
    text: string;
}





export default class Messenger {
    private bot: any;
    private botWrapper: any;

    constructor() {
        // if (process.env.NODE_ENV === 'production') {
        //     this.bot = new TelegramBot(TELEGRAM_TOKEN, { webHook: { port: config.telegram.port, host: config.telegram.host } });
        //     this.bot.setWebHook(config.telegram.externalUrl + ':443/bot' + config.telegram.token);
        // } else {
            this.bot = new TelegramBot(TELEGRAM_TOKEN, { polling: {timeout: 10, interval: 100} });
        // }
        this.botWrapper = new BotWrapper(this.bot);
    }

    listen() {
        try {
            this.bot.on('text', this.handleInput.bind(this));
            this.bot.on('contact', this.handleInput.bind(this));
            this.bot.on('location', this.handleInput.bind(this));
            BOT = this.botWrapper = new BotWrapper(this.bot);
            console.log('Messanger listenning')
            return Promise.resolve()
        } catch (e) {
            console.log('Error', e)
        }
    }

    async handleInput(message: TelegramMessage) {
        const { text, from } = message;

        if (text === '/start') {
            await DB.mongo.collection('users')
                .updateOne(
                {tg_id: from.id},
                {$set: {
                        action: {
                            type: Actions.START
                        }
                    }}
                );
            this.botWrapper.sendMessage(from.id, 'Привет я бот службы доставки! Закажем вам чего то?', Keyboard.homeKeyboard())
            return;
        }

        const { action } = await DB.mongo.collection('users').findOne({tg_id: from.id});

        switch (action.type) {
            case Actions.START:
                await Handlers.start(message, this.botWrapper);
                break;
            case Actions.CHOOSE_POSITION:
                await Handlers.choosePosition(message, this.botWrapper);
                break;
            case Actions.CHOOSE_SIZE:
                await Handlers.chooseSize(message, this.botWrapper);
                break;
            case Actions.CHOOSE_TASTE:
                await Handlers.chooseTaste(message, this.botWrapper);
                break;
            case Actions.CHOOSE_QUANTITY:
                await Handlers.chooseQuantity(message, this.botWrapper);
                break;
            case Actions.BASKET:
                await Handlers.basket(message, this.botWrapper);
                break;
            case Actions.CHECKOUT:
                await Handlers.checkout(message, this.botWrapper);
                break;
            case Actions.PAY_BY_CASH:
                await Handlers.payByChash(message, this.botWrapper);
                break;
            case Actions.PAY_BY_TRANSFER:
                await Handlers.payByChash(message, this.botWrapper);
                break;
        }
    }


}