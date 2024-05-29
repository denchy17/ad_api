import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

let bot;

export const initializeTelegramBot = () => {
  try {
    bot = new TelegramBot(process.env.YOUR_TELEGRAM_BOT_TOKEN, { polling: true });
    bot.onText(/\/verify (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const username = match[1];
    
      try {
        const user = await User.findOneAndUpdate({ email: username }, { isVerified: true });
        if (user) {
          bot.sendMessage(chatId, `User ${username} has been verified.`);
        } else {
          bot.sendMessage(chatId, `User ${username} not found.`);
        }
      } catch (error) {
        bot.sendMessage(chatId, 'Error verifying user.');
        console.error('Error verifying user:', error);
      }
    });
  } catch (error) {
    console.error('Error initializing Telegram bot:', error);
  }
};

export const stopTelegramBot = () => {
  if (bot) {
    bot.stopPolling();
  }
};

export const sendTelegramNotification = async (username, message) => {
    try {
        if (!bot) {
            throw new Error('Telegram bot not initialized');
        }
        await bot.sendMessage(username, message);
        console.log('Telegram notification sent successfully');
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
    }
};
