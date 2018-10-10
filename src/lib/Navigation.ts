import DB from '../db'
import * as Actions from '../actions-constants'
import User from "./User";
import Keyboard from "./Keyboard";
import { BOT } from '../lib/Messanger'
import Basket from "./Basket";


export async function generateFromAction (action, userId: string) {
    switch (action) {
        case Actions.CHOOSE_QUANTITY:
            await chooseQuantityView(userId);
            break;
        case Actions.CHOOSE_POSITION:
            await choosePositionsView(userId);
            break;
        case Actions.CHOOSE_SIZE:
            await chooseSizeView(userId);
            break;
    }
}

export async function chooseQuantityView(userId: string, payload = undefined) {
    await User.updateAction(
        userId,
        Actions.CHOOSE_QUANTITY,
        payload
    );
    BOT.sendMessage(userId, 'Выберите или введите количество:', Keyboard.generateQuantity());
}

export async function choosePositionsView(userId) {
    const positions = await DB.mongo.collection('positions').find().toArray();
    await User.updateAction(userId, Actions.CHOOSE_POSITION);
    BOT.sendMessage(userId, 'Выберите позицию', Keyboard.generatePositions(positions));
}

export async function chooseSizeView(userId, product?: any) {
    if (!product) {
        product = await User.getProduct(userId);
    }
    await User.updateAction(
        userId,
        Actions.CHOOSE_SIZE,
        { product: product._id }
    );
    BOT.sendMessage(userId, 'Выберите размер', Keyboard.generateSizes(product));
}

export async function basketView (userId, prevView?: string) {
    await User.updateAction(
        userId,
        Actions.BASKET
    );
    if (prevView){
        await User.savePrevAction(userId, prevView);
    }
    await Basket.sendMessage(userId, BOT);
}

export async function chooseTasteView(userId, {text, product}) {
    await User.updateAction(
        userId,
        Actions.CHOOSE_TASTE,
        {
            product: product._id,
            size: text
        }
    );
    BOT.sendMessage(userId, 'Выберите вкус:', Keyboard.generateTaste(product.tastes));
    return;
}

export async function homeView(userId) {
    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: userId},
            {$set: {
                    action: {
                        type: Actions.START
                    }
                }}
        );
    BOT.sendMessage(userId, 'Привет я бот службы доставки! Закажем вам чего то?', Keyboard.homeKeyboard())
}

export async function checkout(userId) {
    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: userId},
            {$set: {
                    action: {
                        type: Actions.CHECKOUT
                    }
                }}
        );
    BOT.sendMessage(userId, 'Выберите способ оплаты', Keyboard.checkout())
}

export async function payByCash(userId) {
    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: userId},
            {$set: {
                    action: {
                        type: Actions.PAY_BY_CASH
                    }
                }}
        );
    BOT.sendMessage(
        userId,
        'Ваша заявка принята! В течении 24 часов мы вам сообщим ' +
        'точное время доставки вашего заказа. В случаи необходимости вы можете ' +
        'отменить ваш заказ в разделе "Мои заказы" в главное меню',
        Keyboard.payByCash())
}

export async function payByTransfer(userId) {
    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: userId},
            {$set: {
                    action: {
                        type: Actions.PAY_BY_TRANSFER
                    }
                }}
        );
    BOT.sendMessage(
        userId,
        'ОК, сейчас я вам отправлю счет фактуру (это может занять пару минут). ' +
        'Как только деньги будут перечислены, я вам сообщю точное время доставки вашего заказа. ',
        Keyboard.payByTransfer())
}

