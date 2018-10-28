import * as TelegramBot from 'node-telegram-bot-api'
import DB from '../db'
import {ObjectID} from 'mongodb'
import Keyboard from './Keyboard'
// import Message from './Message'
import BotWrapper from './BotWrapper'
import HandlerRouter from "../command/index"
import AuthCommandCtrl from '../command/Auth'
import * as Actions from '../actions-constants'
import * as Handlers from '../action-handlers/index'
import * as Navigation from './Navigation'
import User from './User'

export let BOT = undefined;
export function getBot() {
    return BOT;
}

enum TelegramToken {
    DEV = '794194362:AAEtS2EIl0okzGpvulrMDTtPoBrN4EDhe2g',
    PRODUCTION = '651163097:AAG5lmkRUX84LLn1NeuI7qLXVF71DP93wmo'
}

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

export interface TelegramMessage {
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
            this.bot = new TelegramBot(TelegramToken.DEV, { polling: {timeout: 10, interval: 100} });
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
        const userId = from.id

        const user = await DB.mongo.collection('users').findOne({tg_id: from.id});

        if (text === '/start') {
            if(!user) {
                return await Navigation.requestPhone(userId);
            }

            if(user.action.type !==  Actions.REQUEST_PHONE
                && user.action.type !==  Actions.REQUEST_LOCATION ) {
                return await Navigation.homeView(userId);
            }
        }


        switch (user.action.type) {
            case Actions.REQUEST_PHONE:
                await Handlers.requestPhone(message, this.botWrapper);
                break;
            case Actions.REQUEST_SHOP_NAME:
                await Handlers.requestShopname(message, this.botWrapper);
                break;
            case Actions.REQUEST_LEGAL_NAME:
                await Handlers.requestLegalName(message, this.botWrapper);
                break;
            case Actions.REQUEST_REGION:
                await Handlers.requestRegion(message, this.botWrapper);
                break;
            case Actions.REQUEST_LOCATION_TEXT:
                await Handlers.requestLocationText(message, this.botWrapper);
                break;
            case Actions.REQUEST_LOCATION:
                await Handlers.requestLocation(message, this.botWrapper);
                break;
            case Actions.REQUEST_BANK_NAME:
                await Handlers.requestBankName(message, this.botWrapper);
                break;
            case Actions.REQUEST_BANK_ACCOUNT_NUMBER:
                await Handlers.requestBankAccountNumber(message, this.botWrapper);
                break;
            case Actions.REQUEST_MFO:
                await Handlers.requestMFO(message, this.botWrapper);
                break;
            case Actions.REQUEST_OKED:
                await Handlers.requestOKED(message, this.botWrapper);
                break;
            case Actions.REQUEST_INN:
                await Handlers.requestINN(message, this.botWrapper);
                break;




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
            case Actions.ORDERS_LIST:
                await Handlers.orderList(message, this.botWrapper);
                break;
        }
    }


}
