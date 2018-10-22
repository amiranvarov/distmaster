// import FixRequest from './fixRequest';
import Help from './Help';
import Start from './Start';
import Register from './Auth';

const DEFAULT_HANDLER_KEY = 'help';
export default class HandlerRouter {
    private handlers;

    constructor() {
        this.handlers = {
            'start': new Start(),
            'help': new Help(),
            'register': new Register(),

            // 'fix': new FixRequest(),
            // 'myrequests': new MyRequests()
        }
    }

    getCommandHandler(message) {
        let command = message.command;

        if (command.indexOf('/') == 0) {
            command = command.substr(1);
        }
        return this.handlers[command] || this.handlers[DEFAULT_HANDLER_KEY];
    }
}
