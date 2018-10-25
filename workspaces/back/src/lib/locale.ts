import { ORDER_STATUS, PAYMENT_TYPE } from './Order'

export function getOrderStatusLocale (orderStatus) {
    switch (orderStatus) {
        case ORDER_STATUS.REVIEW:
            return 'Рассматриватся';

        case ORDER_STATUS.APPROVE:
            return 'Заказ принят';
        case ORDER_STATUS.REJECT:
            return 'Заказ отклонен';
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
