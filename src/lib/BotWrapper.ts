export default class TelegramBot {
    private bot;

    constructor (telegramBot) {
        this.bot = telegramBot;
    }

    sendMessage(userId, message, messageOptions) {
        return this.bot.sendMessage(userId, message, messageOptions);
    }
}
