import * as Buttons from '../common-buttons'
import * as Navigation from '../lib/Navigation'


export async function payByChash ({text, from}, bot) {
    switch (text) {
        case Buttons.GO_MAIN_MANU:
            await Navigation.homeView(from.id);
            break;
    }
}
