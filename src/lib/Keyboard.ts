import * as _ from 'lodash'
import * as Buttons from '../common-buttons'

export enum HOME_BUTTONS {
    CREATE_ORDER = "Сделать новый заказ",
    CHECK_ORDER_STATUS ="Проверить статус заказов",
    CHANGE_SETTINGS = "Настройки"
};

export default class KeyboardBuilder {

    static homeKeyboard () {
        return {
            "parse_mode": "Markdown",
            "reply_markup": {
                "one_time_keyboard": true,
                "resize_keyboard": true,
                "keyboard": [
                    [HOME_BUTTONS.CREATE_ORDER],
                    [HOME_BUTTONS.CHECK_ORDER_STATUS],
                    [HOME_BUTTONS.CHANGE_SETTINGS],
                ]
            }
        }
    }

    static async generatePositions (names) {
        const buttons = _.chunk(names, 2);
        buttons.push([Buttons.BACK, Buttons.BASKET]);
        return {
            "parse_mode": "Markdown",
            "reply_markup": {
                "one_time_keyboard": true,
                "resize_keyboard": true,
                "keyboard": buttons
            }
        }
    }

    static generateSizes (sizes: string[]) {
        const buttons = _.chunk(sizes, 2);
        buttons.push([Buttons.BACK, Buttons.BASKET]);
        return {
            "parse_mode": "Markdown",
            "reply_markup": {
                "one_time_keyboard": true,
                "resize_keyboard": true,
                "keyboard": buttons
            }
        }
    }

    static generateFlavors (flavors) {
        return {
            "parse_mode": "Markdown",
            "reply_markup": {
                "one_time_keyboard": true,
                "resize_keyboard": true,
                "keyboard": _.chunk(flavors, 3)
            }
        }
    }

    static generateQuantity (userId, itemsInPack) {
        let quantities: any = [
          10,
          20,
          30,
          40,
          50,
          60,
          70,
          80,
          90
        ];

        quantities = quantities.map( quantity => {
            return `${quantity} (${ quantity * itemsInPack } шт)`
        });

        quantities = [
            ...quantities,
            Buttons.BACK,
            Buttons.BASKET
        ];

        const buttons = _.chunk(quantities, 3);
        return {
            "parse_mode": "Markdown",
            "reply_markup": {
                "one_time_keyboard": true,
                "resize_keyboard": true,
                "keyboard": buttons
            }
        }
    }

    static async generateBasket (orders) {
        const buttons = orders.map((order, index) => [`❌ №${(index + 1)} ${order.name} ${order.size}`]);
        buttons.push(['🚖 Оформить заказ']);
        return {
            parse_mode: "HTML",
            "reply_markup": {
                "one_time_keyboard": true,
                "resize_keyboard": true,
                "keyboard": [
                    ['⬅ Назад', '🔄 Очистить'],
                    ...buttons
                ]
            }
        }
    }

    static emptyBasket () {
        return {
            parse_mode: "HTML",
            "reply_markup": {
                "one_time_keyboard": true,
                "resize_keyboard": true,
                "keyboard": [
                    ['⬅ Назад'],
                ]
            }
        }
    }

    static checkout () {
        return {
            parse_mode: "HTML",
            "reply_markup": {
                "one_time_keyboard": true,
                "resize_keyboard": true,
                "keyboard": [
                    [Buttons.PAYMENT_TYPE_CASH, Buttons.PAYMENT_TYPE_TRANSFER],
                    [Buttons.BACK]
                ]
            }
        }
    }

    static payByCash () {
        return {
            parse_mode: "HTML",
            "reply_markup": {
                "one_time_keyboard": true,
                "resize_keyboard": true,
                "keyboard": [
                    [Buttons.GO_MAIN_MANU]
                ]
            }
        }
    }

    static payByTransfer () {
        return {
            parse_mode: "HTML",
            "reply_markup": {
                "one_time_keyboard": true,
                "resize_keyboard": true,
                "keyboard": [
                    [Buttons.GO_MAIN_MANU]
                ]
            }
        }
    }

    // ORDERS
    static orderList () {
        return {
            parse_mode: "HTML",
            "reply_markup": {
                "one_time_keyboard": true,
                "resize_keyboard": true,
                "keyboard": [
                    [Buttons.BACK]
                ]
            }
        }
    }


}
