const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');

const token = '6138883677:AAGidCFkaCzVshI2GCOpq41nmYnboXUHPLk';

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Now I will guess a number from 0-9, and you have to guess it!');
    chats[chatId] = Math.floor(Math.random() * 10);

    await bot.sendMessage(chatId, 'Guess!', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Greeting' },
        { command: '/name', description: 'Your name and surname' },
        { command: '/game', description: 'Guess the number game' }
    ]);

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'hello.webp');
            return bot.sendMessage(chatId, 'Welcome to telegram bot!!!');
        }

        if (text === '/name') {
            return bot.sendMessage(chatId, `Your name: ${msg.from.first_name}, surname: ${msg.from.last_name}`);
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'I don\'t understand you, try again!');
    });

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        console.log(msg);

        if (data === '/again') {
            return startGame(chatId);
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Congratulations, you guessed the number - ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `Unfortunately, you didn't guess. The bot guessed a number - ${chats[chatId]}`, againOptions);
        }
    })
}

start();
