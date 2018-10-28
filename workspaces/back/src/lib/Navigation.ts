import DB from '../db'
import * as Actions from '../actions-constants'
import User from "./User";
import Position from '../Model/Position'
import Keyboard from "./Keyboard";
import { BOT } from './Messanger'
import Basket from "./Basket";
import Order from './Order';
import * as PDF from './PDF'
import * as moment from 'moment';
moment.locale('ru')
import  { getOrderStatusLocale, getPaymentTypeLocale } from './locale'


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
                    }
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

    await Order.create({userId, products, paymentMethod: 'cash'});
    await Basket.clearBasket(userId);
}

export async function payByTransfer(userId) {
    const contractDate = moment('2017-02-13T00:00:00+00:00');
    const contract  = {
        number: 615,
        date: {
            day: contractDate.format('DD'),
            month: contractDate.format('MMMM'),
            year: contractDate.format('YYYY')
        }
    };

    const orderDate = moment();
    const nextOrderNumber = await DB.getNextSequenceValue('invoiceid');
    const order = {
        number: `${nextOrderNumber}/${contract.number}`,
        date: {
            day: orderDate.format('DD'),
            month: orderDate.format('MMMM'),
            year: orderDate.format('YYYY')
        }
    };

    const products = await Basket.getProducts(userId);
    await DB.mongo.collection('users')
        .updateOne(
            {tg_id: userId},
            {$set: {
                    action: {
                        type: Actions.PAY_BY_TRANSFER
                    },
                }}
        );
    BOT.sendMessage(
        userId,
        'ОК, сейчас я вам отправлю счет на оплату (это может занять пару минут). ' +
        'Как только деньги будут перечислены, я вам сообщю точное время доставки вашего заказа. ',
        Keyboard.payByTransfer());

    const {phone, shop} = (await DB.mongo.collection('users').findOne({tg_id: userId}));
    PDF.sendSpecification({userId, products, order, contract});
    PDF.sendInvoice({userId, products, order, contract, phone, shop });
    await Order.create({userId, products, paymentMethod: 'transfer', orderNumber: order.number});
    await Basket.clearBasket(userId);
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
        message += `Дата заказа: ${moment(order.create_time).format('DD.MM.YYYY')}\n`
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




