import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import UserService from "./services/UserService";
import COMMANDS, { COMMAND_LIST } from "./utils/commands";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN || "");
const user = new UserService();

bot.use(async (ctx, next) => {
  if (!user.getToken()) {
    const chat = await ctx.getChat();
    await user.checkIfUserExists(chat.id);
  }

  next();
});

// telegram commands
bot.start(async (ctx) => {
  const chat: any = await ctx.getChat();

  if (user.getToken()) {
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
      parse_mode: "HTML",
    }
  );
});

bot.help((ctx) => {
  let manual = `*("Reference manual:*`;
  COMMANDS.forEach((cmd) => {
    manual = `
${manual}
/${cmd.command} - _${cmd.description}_
    `;
  });

  ctx.reply(manual, { parse_mode: "Markdown" });
});

// custom commands
bot.command(COMMAND_LIST.REGISTER, async (ctx) => {
  const chat: any = await ctx.getChat();

  if (user.getToken()) {
    ctx.reply("We appreciate your enthusiasm, but you are already registered!");
    return;
  }

  const response = await user.createUser({
    firstName: chat.first_name,
    lastName: chat.last_name,
    username: chat.username,
    telegramId: chat.id.toString(),
    isPremium: chat.is_premium ?? false,
  });

  if (!response.success) {
    ctx.reply("Sorry, something went wrong!");
    return;
  }

  ctx.reply("You have successfully registered!");
});

// miscellaneous message handler
bot.on("text", (ctx) => {
  ctx.reply(
    "Please use /help command to see how <strong>imasterit</strong> can help you.",
    { parse_mode: "HTML" }
  );
});

bot.launch();
