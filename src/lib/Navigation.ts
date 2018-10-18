import DB from '../db'
import * as Actions from '../actions-constants'
import User from "./User";
import Position from '../Model/Position'
import Keyboard from "./Keyboard";
import { BOT } from '../lib/Messanger'
import Basket from "./Basket";
import Order from './Order';
import * as PDF from '../lib/PDF'
import * as moment from 'moment';
import  { getOrderStatusLocale } from '../lib/locale'


export async function generateFromAction (action, userId: string) {
    switch (action) {
        case Actions.CHOOSE_QUANTITY:
            await chooseQuantityView({userId});
            break;
        case Actions.CHOOSE_POSITION:
            await choosePositionsView(userId);
            break;
        case Actions.CHOOSE_SIZE:
            await chooseSizeView(userId);
            break;
    }
}

// refer from chooseSize
export async function chooseQuantityView({userId, productName, selectedSize}) {
    let product;

    if (productName && selectedSize) {
        product = await Position.getOne({name: productName, size: selectedSize});
    } else {
        product = await User.getProduct(userId);
    }

    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: userId},
            {
                $set: {
                    'action.type': Actions.CHOOSE_QUANTITY,
                    'action.payload': {
                        product_id: product._id
                    }
                }
            }
        );

    BOT.sendMessage(userId,
        `Выберите или введите количество упаковок. В одной упаковке ${product.pack} штук.`,
        Keyboard.generateQuantity(userId, product.pack)
    );
}

export async function choosePositionsView(userId) {
    const positionsNames = await Position.getNames();
    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: userId},
            {
                $set: {
                    action: {
                        type: Actions.CHOOSE_POSITION
                    }}
                }
        );
    BOT.sendMessage(userId, 'Выберите позицию', await Keyboard.generatePositions(positionsNames));
}

export async function chooseSizeView({userId, name} : {userId: string, name?: string}) {
    let product;

    if (!name) {
        product = await User.getProduct(userId);
    }

    await User.updateAction(
        userId,
        Actions.CHOOSE_SIZE,
        { name }
    );
    const productSizes = await Position.getSizes({name: name || product.name});
    BOT.sendMessage(userId, 'Выберите размер', Keyboard.generateSizes(productSizes));
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

export async function chooseFlavorView(userId, {text, selectedSize, flavors}) {
    await User.updateAction(
        userId,
        Actions.CHOOSE_TASTE,
        {
            size: selectedSize
        }
    );
    BOT.sendMessage(userId, 'Выберите вкус:', Keyboard.generateFlavors(flavors));
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
    const products = await Basket.getProducts(userId);
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
        Keyboard.payByCash());

    await Order.create(userId, products);
    await Basket.clearBasket(userId);
}

export async function payByTransfer(userId) {
    const products = await Basket.getProducts(userId);
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
        Keyboard.payByTransfer());

    await PDF.sendInvoice(userId, products);
    await Order.create(userId, products);
    await Basket.clearBasket(userId);
}

export async function getOrders(userId) {
    const orders = await Order.getAll(userId);

    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: userId},
            {$set: {
                    action: {
                        type: Actions.ORDERS_LIST
                    }
                }}
        );

    if (orders.length === 0 ) {
        return BOT.sendMessage(userId, 'У вас пока нет созданных заказов', Keyboard.orderList());
    }

    let message = 'Ваши заказы: ';

    orders.map(order => {
        message += `Дата заказа: ${moment(order.create_time).format('DD.MM.YYYY')}\n`
        + `Сумма заказа: ${order.amount}\n`
        + `Статус: ${getOrderStatusLocale(order.status)}`
    });

    return BOT.sendMessage(userId, message, Keyboard.orderList());
}




