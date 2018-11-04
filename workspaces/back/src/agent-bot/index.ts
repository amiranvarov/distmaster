const Telegraf = require('telegraf')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const {leave} = Stage
import Keyboard from '../lib/Keyboard'
import Agent from '../Model/Agent'


// Greeter scene
const greeter = new Scene('greeter')
greeter.enter((ctx) => ctx.reply('Привет! Пожалуйста отправьте ваш омер телефона нажав на кнопку ниже', Keyboard.requestPhone()))
greeter.leave((ctx) => ctx.reply('Спасибо! Скоро наш администратор рассмотрит вашу регистрацию и после этого вы будете видеть заказы с вашей территории', Keyboard.empty()))
greeter.on('message', async (ctx) => {
    // console.log('CTX', ctx)
    const { message: { contact, from } } = ctx;
    if (!contact) {
        return ctx.reply('Вы должны отправить свой контакт')
    }
    if (from.id !== contact.user_id) {
        return ctx.reply('Отправье ВАШ СОБСТВЕННЫЙ НОМЕР нажав на кнопку ниже')
    }
    const agent = {
        phone: contact.phone_number,
        name: `${contact.first_name} ${contact.last_name}`,
        tg_id: contact.user_id
    };
    await Agent.create(agent);
    ctx.scene.leave();
});

// Create scene manager
const stage = new Stage()
stage.command('cancel', leave())

// Scene registration awdwd
stage.register(greeter)

export const bot = new Telegraf(process.env.AGENT_BOT_TOKEN)
bot.use(session())
bot.use(stage.middleware())
bot.command('start', async(ctx) => {
    const userExists = await Agent.exists({tg_id: ctx.from.id});
    console.log('User id:', ctx.from.id)
    console.log('userExists', userExists)
    if (!userExists) {
        ctx.scene.enter('greeter')
    }
})

export const init = () => {
    bot.startPolling();
}

