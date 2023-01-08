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
const UserService_1 = __importDefault(require("./services/UserService"));
const commands_1 = __importStar(require("./utils/commands"));
dotenv_1.default.config();
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN || "");
const user = new UserService_1.default();
bot.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user.getToken()) {
        const chat = yield ctx.getChat();
        yield user.checkIfUserExists(chat.id);
    }
    next();
}));
// telegram commands
bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chat = yield ctx.getChat();
    if (user.getToken()) {
        ctx.reply(`Welcome back ${(_a = chat.first_name) !== null && _a !== void 0 ? _a : chat.username}! Thanks for using imasterit`);
        return;
    }
    ctx.reply(`
Hi <i>${chat.first_name}</i>
Welcome to <strong>imasterit!</strong>
You don't have an account.
Use <strong>/register</strong> command to sign up.
  `, {
        parse_mode: "HTML",
    });
}));
bot.help((ctx) => {
    let manual = `*("Reference manual:*`;
    commands_1.default.forEach((cmd) => {
        manual = `
${manual}
/${cmd.command} - _${cmd.description}_
    `;
    });
    ctx.reply(manual, { parse_mode: "Markdown" });
});
// custom commands
bot.command(commands_1.COMMAND_LIST.REGISTER, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const chat = yield ctx.getChat();
    if (user.getToken()) {
        ctx.reply("We appreciate your enthusiasm, but you are already registered!");
        return;
    }
    const response = yield user.createUser({
        firstName: chat.first_name,
        lastName: chat.last_name,
        username: chat.username,
        telegramId: chat.id.toString(),
        isPremium: (_b = chat.is_premium) !== null && _b !== void 0 ? _b : false,
    });
    if (!response.success) {
        ctx.reply("Sorry, something went wrong!");
        return;
    }
    ctx.reply("You have successfully registered!");
}));
// miscellaneous message handler
bot.on("text", (ctx) => {
    ctx.reply("Please use /help command to see how <strong>imasterit</strong> can help you.", { parse_mode: "HTML" });
});
bot.launch();
