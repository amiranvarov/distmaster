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

    static generatePositions (items) {
        const buttons = _.chunk(items.map(item => item.name), 2);
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

    static generateSizes (product) {
        const buttons = _.chunk(product.sizes.map(item => item.size), 2);
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

    static generateTaste (tastes) {
        return {
            "parse_mode": "Markdown",
            "reply_markup": {
                "one_time_keyboard": true,
                "resize_keyboard": true,
                "keyboard": _.chunk(tastes, 3)
            }
        }
    }

    static generateQuantity () {
        const sets = [
            '100',
            '250',
            '300',
            '500',
            '1000',
            '1500',
            '2000',
            '2500',
            '3000',
            '4000',
            '5000',
            '6000',
            '7000',
            '8000',
            '9000',
            Buttons.BACK,
            Buttons.BASKET
        ];
        const buttons = _.chunk(sets, 3);
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
                    ['⬅ Назад', '🔄 Очистить'],
                    ['🚖 Оформить заказ']
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
}
