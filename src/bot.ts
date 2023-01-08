import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import UserService from './services/UserService';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN || '');

bot.start(async (ctx) => {
  const chat: any = await ctx.getChat();
  ctx.reply(`Hi ${chat.first_name}! imaster will help you master IT!`);
  const user = new UserService();
  const response = await user.createUser({
    firstName: chat.first_name,
    lastName: chat.last_name,
    telegramId: chat.id,
    isPremium: chat.is_premium ?? false,
  });
  if (response.success) {
    ctx.reply('You have successfully registered!');
  }
});

bot.launch();
