import { ORDER_STATUS } from '../lib/Order'

export function getOrderStatusLocale (orderStatus) {
    switch (orderStatus) {
        case ORDER_STATUS.REVIEW:
            return 'Рассматриватся';

        case ORDER_STATUS.SENT:
            return 'Заказ принят';
    }
}
