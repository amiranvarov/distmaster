import DB from '../db'
import * as Actions from '../actions-constants'
import User from "./User";
import Position from '../Model/Position'
import Agent from '../Model/Agent'
import Keyboard from "./Keyboard";
import { BOT } from './Messanger'
import Basket from "./Basket";
import Order from './Order';
import * as PDF from './PDF'
import * as moment from 'moment';
moment.locale('ru')
import  { getOrderStatusLocale, getPaymentTypeLocale } from './locale'
import {uploadToS3} from "./S3";
import * as fs from "fs";
import { bot as AgentBot} from '../agent-bot'
import {renderProductsList, getOrderTotalPrice} from '../helpers'


export async function generateFromAction (action, userId: string) {
    switch (action) {
        case Actions.CHOOSE_QUANTITY:
            await chooseQuantityView({userId});
            break;
        case Actions.CHOOSE_POSITION:
            await choosePositionsView({userId});
            break;
        case Actions.CHOOSE_SIZE:
            await chooseSizeView({userId});
            break;
    }
}

/**
 * AUTH FLOW
 */
export async function requestPhone(userId: number) {
    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: userId},
            {$set: {
                    action: {
                        type: Actions.REQUEST_PHONE
                    },
                    create_time: new Date(),
                    status: 'review'
                }},
            {upsert: true}
        );
    BOT.sendMessage(
        userId,
        'Добро пожаловать! \n' +
        'Пожалуйста предоставьте ваш номер что бы мы вас зарегистрировали в нашей системе. ' +
        'Не волнуйтесь, мы никому не сообщим ваш номер',
        Keyboard.requestPhone()
    )
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







export async function chooseQuantityView({userId, productName, selectedSize} : {userId: string, productName?: string, selectedSize?: string}) {
    let product;

    if (productName && selectedSize) {
        product = await Position.getOne({ name: productName, size: selectedSize });
    } else {
        product = await User.getProduct(userId);
    }

    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: userId},
            {
                $set: {
                    action: {
                        type: Actions.CHOOSE_QUANTITY,
                        payload: {
                            product_id: product._id
                        }
                    }
                }
            }
        );

    BOT.sendMessage(userId,
        `Выберите или введите количество упаковок. В одной упаковке ${product.pack} штук.`,
        Keyboard.generateQuantity(userId, product.pack)
    );
}

export async function choosePositionsView({userId}) {
    const positionsNames = await Position.getNames();
    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: userId},
            {
                $set: {
                    action: {
                        type: Actions.CHOOSE_POSITION,
                        payload: {}
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
    const user = await User.findOne({tg_id: userId});
    const { phone, shop } = user;
    const products = await Basket.getProducts(userId);
    const contract  = User.getContractDetails(user);
    const order = User.getNextOrderNumber(user);

    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: userId},
            {
                $set: {
                    action: {
                        type: Actions.PAY_BY_CASH
                    }
                },
                $inc: {
                    last_order_number: 1
                }
            }
        );
    BOT.sendMessage(
        userId,
        'Ваша заявка принята! В течении 24 часов мы вам сообщим ' +
        'точное время доставки вашего заказа. В случаи необходимости вы можете ' +
        'отменить ваш заказ в разделе "Мои заказы" в главное меню',
        Keyboard.payByCash());

    const fileURL = await PDF.getInvoiceFile({userId, products, order, contract, phone, shop });

    const orderNumber = `${contract.number}/${order.number}`;
    await Order.create({
        userId,
        products,
        paymentMethod: 'cash',
        invoiceURL: fileURL,
        orderNumber,
    });

    await Basket.clearBasket(userId);

    // отправляем уведомление агентам
    let message = '' +
        'НОВЫЙ ЗАКАЗ\n\n' +
        `РЕГИОН: ${user.shop.region}\n`+
        `НАЗВАНИЕ: ${user.shop.name} (${user.shop.legal_name})\n`+
        `АДРЕС: ${user.shop.location_text}\n`+
        `ФОРМА ОПЛАТЫ: Наличные\n`+
        `СЧЕТ НА ОПЛАТУ: <a href="${fileURL}">${orderNumber}</a>\n`+
        `ТОВАРЫ:\n\n`;
    message += renderProductsList(products);

    const agents = await Agent.getAll({region: user.shop.region});
    await Promise.all(agents.map(async agent => {
        await AgentBot.telegram.sendMessage(
            agent.tg_id,
            message,
            {"parse_mode": "html",}
        )
    }))
}

export async function payByTransfer(userId) {
    const user = await User.findOne({tg_id: userId});
    const { phone, shop } = user;

    const contract  = User.getContractDetails(user);
    const order = User.getNextOrderNumber(user);

    const products = await Basket.getProducts(userId);
    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: userId},
            {
                $set: {
                    action: {
                        type: Actions.PAY_BY_TRANSFER
                    },

                },
                $inc: {
                    last_order_number: 1
                }
            }
        );
    await BOT.sendMessage(
        userId,
        'ОК, сейчас я вам отправлю счет на оплату (это может занять пару минут). ' +
        'Как только деньги будут перечислены, я вам сообщю точное время доставки вашего заказа. ',
        Keyboard.payByTransfer());
    const fileURL = await PDF.getInvoiceFile({userId, products, order, contract, phone, shop });

    await BOT.sendDocument(userId, fileURL, {caption: 'Счет на оплату'});

    const orderNumber = `${contract.number}/${order.number}`;
    await Order.create({
        userId,
        products,
        paymentMethod: 'transfer',
        orderNumber,
        invoiceURL: fileURL
    });
    await Basket.clearBasket(userId);

    // отправляем уведомление агентам
    let message = '' +
        'НОВЫЙ ЗАКАЗ\n\n' +
        `РЕГИОН: ${user.shop.region}\n`+
        `НАЗВАНИЕ: ${user.shop.name} (${user.shop.legal_name})\n`+
        `АДРЕС: ${user.shop.location_text}\n`+
        `ФОРМА ОПЛАТЫ: Перечисление\n`+
        `СЧЕТ НА ОПЛАТУ: <a href="${fileURL}">${orderNumber}</a>\n`+
        `ТОВАРЫ:\n\n`;
    message += renderProductsList(products);

    const agents = await Agent.getAll({region: user.shop.region});
    await Promise.all(agents.map(async agent => {
        await AgentBot.telegram.sendMessage(
            agent.tg_id,
            message,
            {"parse_mode": "html",}
        )
    }))

    // отправляем менеджерам
    const managers = await Agent.getAll({region: 'all'});
    await Promise.all(managers.map(async manager => {
        await AgentBot.telegram.sendMessage(
            manager.tg_id,
            message,
            {"parse_mode": "html",}
        )
    }))
}

export async function getOrders(userId) {
    const orders = await Order.getAll({user_id: userId});

    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: userId},
            {$set: {
                    action: {
                        type: Actions.ORDERS_LIST
                    }
                }}
        );

    if (orders.length < 1 ) {
        return BOT.sendMessage(userId, 'У вас пока нет созданных заказов', Keyboard.orderList());
    }

    let message = 'Ваши заказы: \n';

    orders.map((order: any, index: number) => {

        const amount = order.products.map(product => (
            Basket.getPriceForUserType(product) * product.pack * product.quantity)
        ).reduce((a,b) => (a + b), 0);

        if(index === 0) {
            message += '--------------\n'
        }
        message += `Дата заказа: ${moment.unix(order.create_time).format('DD.MM.YYYY')}\n`
        + `Сумма заказа: ${amount.toLocaleString()}\n`
        + `Статус: ${getOrderStatusLocale(order.status)}\n`;

        if(order.status === 'approve') {
            message += `Дата достави: ${order.delivery_date}\n`
        } else if (order.status === 'reject') {
            message += `Причина отказа: ${order.reject_reason}\n`
        }

        message += `Форма оплаты: ${getPaymentTypeLocale(order.payment_type)}\n`
        + `--------------\n`;
    });

    return BOT.sendMessage(userId, message, Keyboard.orderList());
}




