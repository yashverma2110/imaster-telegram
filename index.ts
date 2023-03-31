import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

import UserService from './src/services/UserService';
import COMMANDS, { commandList } from './src/utils/commands';

import { bold, italic } from './src/utils/formatter';
import { CronService } from './src/services/CronService';
import dateUtil from './src/utils/dayjs';

dotenv.config();

const bot = new Telegraf('5888007620:AAHQ2no-8ySpAoNytscSbKCxtNn7yc7mADI');

bot.use(async (ctx, next) => {
  if (!ctx.state.token) {
    const chat = await ctx.getChat();
    const { token } = await UserService.checkIfUserExists(chat.id);

    if (token) {
      ctx.state.token = token;
    }
  }

  next();
});

// telegram commands
bot.start(async (ctx) => {
  const chat: any = await ctx.getChat();

  if (ctx.state.token) {
    ctx.reply(
      `Welcome back ${
        chat.first_name ?? chat.username
      }! Thanks for using imasterit`
    );
    return;
  }

  ctx.reply(
    `
Hi <i>${chat.first_name}</i>
Welcome to <strong>imasterit!</strong>
You don't have an account.
Use <strong>/register</strong> command to sign up.
  `,
    {
      parse_mode: 'HTML',
    }
  );
});

bot.help((ctx) => {
  let manual = `*Reference manual:*`;
  COMMANDS.forEach((cmd) => {
    manual = `
${manual}
/${cmd.command} - _${cmd.description}_
    `;
  });

  ctx.reply(manual, { parse_mode: 'Markdown' });
});

// custom commands
bot.command(commandList.REGISTER, async (ctx) => {
  const chat: any = await ctx.getChat();

  if (ctx.state.token) {
    ctx.reply('We appreciate your enthusiasm, but you are already registered!');
    return;
  }

  const { success, token } = await UserService.createUser({
    firstName: chat.first_name,
    lastName: chat.last_name,
    username: chat.username,
    telegramId: chat.id.toString(),
    isPremium: chat.is_premium ?? false,
  });

  if (!success) {
    ctx.reply('Sorry, something went wrong!');
    return;
  }

  ctx.state.token = token;

  ctx.reply('You have successfully registered!');
});

bot.command(commandList.LIST, async (ctx) => {
  const { success, topics = [] } = await UserService.getAllTopics();

  if (!success) {
    ctx.reply('Sorry, something went wrong!');
    return;
  }

  let message = `*Available topics:*`;

  topics.forEach((topic: Topic, index: number) => {
    message = `
${message}
${index + 1}. ${italic(topic.name)} ${bold(topic.shortName)}
    `;
  });

  message = `
${message}
*Use the /${commandList.SUBSCRIBE} <topic name> command to subscribe to a topic*
${italic(
  `For eg: /${commandList.SUBSCRIBE} ${topics[0].shortName} to subscribe to ${topics[0].name}`
)}
  `;

  ctx.reply(message, { parse_mode: 'Markdown' });
});

bot.command(commandList.SUBSCRIBE, async (ctx: any) => {
  const args = ctx.message?.text.split(' ').slice(1);
  const topicName = args[0];

  if (!topicName) {
    ctx.reply('Please specify a topic name! \n For eg: /subscribe js');
    return;
  }

  const { success, data, isTopicNotFound, isAlreadySubscribed } =
    await UserService.subscribeToTopic(topicName, ctx.state.token);

  if (!success) {
    if (isTopicNotFound) {
      ctx.reply(
        `Sorry, we couldn't find a topic with the name *${topicName}*!\n${italic(
          `Use the /${commandList.LIST} command to see all available topics`
        )}`,
        { parse_mode: 'Markdown' }
      );
      return;
    }

    if (isAlreadySubscribed) {
      ctx.reply(
        `You're already subscribed to ${bold(topicName)} ✅\n${italic(
          `Use the /${commandList.LIST} command to see all available topics`
        )}`,
        { parse_mode: 'Markdown' }
      );
      return;
    }

    ctx.reply('Sorry, something went wrong!');
    return;
  }

  console.log('🚀 ~ file: index.ts:167 ~ bot.command ~ data:', data);
  const { success: isCronSuccess } = await CronService.scheduleConcept({
    topicId: data.subscription.topicId,
    token: ctx.state.token,
    bot,
    chatId: ctx.chat.id,
    time:
      dateUtil().add(1, 'minute').format('hh:mm A') ??
      data.subscription.remindAt,
  });

  if (!isCronSuccess) {
    ctx.reply('Cron schedule failed');
  }
  ctx.reply(
    `You have successfully subscribed to the ${italic(topicName)} 🎉!`,
    {
      parse_mode: 'Markdown',
    }
  );
});

// miscellaneous message handler
bot.on('message', (ctx) => {
  ctx.reply("Sorry, I didn't understand that!");
});

bot.launch();
