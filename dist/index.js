"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const dotenv_1 = __importDefault(require("dotenv"));
const UserService_1 = __importDefault(require("./src/services/UserService"));
const commands_1 = __importStar(require("./src/utils/commands"));
const formatter_1 = require("./src/utils/formatter");
const CronService_1 = require("./src/services/CronService");
dotenv_1.default.config();
const bot = new telegraf_1.Telegraf('5888007620:AAHQ2no-8ySpAoNytscSbKCxtNn7yc7mADI');
bot.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ctx.state.token) {
        const chat = yield ctx.getChat();
        const { token } = yield UserService_1.default.checkIfUserExists(chat.id);
        if (token) {
            ctx.state.token = token;
        }
    }
    next();
}));
// telegram commands
bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chat = yield ctx.getChat();
    if (ctx.state.token) {
        ctx.reply(`Welcome back ${(_a = chat.first_name) !== null && _a !== void 0 ? _a : chat.username}! Thanks for using imasterit`);
        return;
    }
    ctx.reply(`
Hi <i>${chat.first_name}</i>
Welcome to <strong>imasterit!</strong>
You don't have an account.
Use <strong>/register</strong> command to sign up.
  `, {
        parse_mode: 'HTML',
    });
}));
bot.help((ctx) => {
    let manual = `*Reference manual:*`;
    commands_1.default.forEach((cmd) => {
        manual = `
${manual}
/${cmd.command} - _${cmd.description}_
    `;
    });
    ctx.reply(manual, { parse_mode: 'Markdown' });
});
// custom commands
bot.command(commands_1.commandList.REGISTER, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const chat = yield ctx.getChat();
    if (ctx.state.token) {
        ctx.reply('We appreciate your enthusiasm, but you are already registered!');
        return;
    }
    const { success, token } = yield UserService_1.default.createUser({
        firstName: chat.first_name,
        lastName: chat.last_name,
        username: chat.username,
        telegramId: chat.id.toString(),
        isPremium: (_b = chat.is_premium) !== null && _b !== void 0 ? _b : false,
    });
    if (!success) {
        ctx.reply('Sorry, something went wrong!');
        return;
    }
    ctx.state.token = token;
    ctx.reply('You have successfully registered!');
}));
bot.command(commands_1.commandList.LIST, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, topics = [] } = yield UserService_1.default.getAllTopics();
    if (!success) {
        ctx.reply('Sorry, something went wrong!');
        return;
    }
    let message = `*Available topics:*`;
    topics.forEach((topic, index) => {
        message = `
${message}
${index + 1}. ${(0, formatter_1.italic)(topic.name)} ${(0, formatter_1.bold)(topic.shortName)}
    `;
    });
    message = `
${message}
*Use the /${commands_1.commandList.SUBSCRIBE} <topic name> command to subscribe to a topic*
${(0, formatter_1.italic)(`For eg: /${commands_1.commandList.SUBSCRIBE} ${topics[0].shortName} to subscribe to ${topics[0].name}`)}
  `;
    ctx.reply(message, { parse_mode: 'Markdown' });
}));
bot.command(commands_1.commandList.SUBSCRIBE, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const args = (_c = ctx.message) === null || _c === void 0 ? void 0 : _c.text.split(' ').slice(1);
    const topicName = args[0];
    if (!topicName) {
        ctx.reply('Please specify a topic name! \n For eg: /subscribe js');
        return;
    }
    const { success, isTopicNotFound, isAlreadySubscribed } = yield UserService_1.default.subscribeToTopic(topicName, ctx.state.token);
    if (!success) {
        if (isTopicNotFound) {
            ctx.reply(`Sorry, we couldn't find a topic with the name *${topicName}*!\n${(0, formatter_1.italic)(`Use the /${commands_1.commandList.LIST} command to see all available topics`)}`, { parse_mode: 'Markdown' });
            return;
        }
        if (isAlreadySubscribed) {
            ctx.reply(`You're already subscribed to ${(0, formatter_1.bold)(topicName)} ✅\n${(0, formatter_1.italic)(`Use the /${commands_1.commandList.LIST} command to see all available topics`)}`, { parse_mode: 'Markdown' });
            return;
        }
        ctx.reply('Sorry, something went wrong!');
        return;
    }
    const { success: isCronSuccess } = yield CronService_1.CronService.scheduleConcept({
        topic: '',
        token: ctx.state.token,
        bot,
        chatId: ctx.chat.id,
    });
    if (!isCronSuccess) {
        ctx.reply('Cron schedule failed');
    }
    ctx.reply(`You have successfully subscribed to the ${(0, formatter_1.italic)(topicName)} 🎉!`, {
        parse_mode: 'Markdown',
    });
}));
// miscellaneous message handler
bot.on('message', (ctx) => {
    ctx.reply("Sorry, I didn't understand that!");
});
bot.launch();
