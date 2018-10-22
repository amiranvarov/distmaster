import Keyboard from "../lib/Keyboard";
import * as Buttons from '../common-buttons'
import DB from '../db'
import * as Actions from '../actions-constants'
import User from '../lib/User'
import * as Navigation from '../lib/Navigation'

export async function checkout ({text, from}, bot) {
    switch (text) {
        case Buttons.BACK:
            await Navigation.basketView(from.id);
            break;

        case Buttons.PAYMENT_TYPE_CASH:
            await Navigation.payByCash(from.id);
            break;

        case Buttons.PAYMENT_TYPE_TRANSFER:
            await Navigation.payByTransfer(from.id);
            break;
    }
}
