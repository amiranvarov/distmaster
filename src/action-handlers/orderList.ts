import * as Buttons from '../common-buttons'
import * as Navigation from '../lib/Navigation'

export async function orderList ({text, from}, bot) {
    const userId = from.id;
    switch (text) {
        case Buttons.BACK:
            await Navigation.homeView(userId);
            break;
    }
}
