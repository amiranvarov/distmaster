import { ORDER_STATUS, PAYMENT_TYPE } from '../lib/Order'

export function getOrderStatusLocale (orderStatus) {
    switch (orderStatus) {
        case ORDER_STATUS.REVIEW:
            return 'Рассматриватся';

        case ORDER_STATUS.SENT:
            return 'Заказ принят';
    }
}

export function getPaymentTypeLocale (orderStatus) {
    switch (orderStatus) {
        case PAYMENT_TYPE.CASH:
            return 'Наличные';

        case PAYMENT_TYPE.Transfer:
            return 'Перечисление';
    }
}
