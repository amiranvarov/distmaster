export default class Help {
    handle(message, bot) {
        return bot.sendMessage(message.from, '/fix your_address_and_problem_description - to submit request (e.g. /fix NY. TV got broken)\n'
            + '/myrequests - to get submitted request');
    }
}
