import Keyboard, { HOME_BUTTONS } from "../lib/Keyboard";
import DB from '../db'
import * as Actions from '../actions-constants'
import User from '../lib/User'
import * as Navigation from '../lib/Navigation'

export async function start ({text, from}, bot) {
    const userId = from.id;
    switch (text) {
        case HOME_BUTTONS.CREATE_ORDER:
            await Navigation.choosePositionsView(userId);
            break;

        case HOME_BUTTONS.CHECK_ORDER_STATUS:
            await Navigation.getOrders(userId)
            break;
    }
}
