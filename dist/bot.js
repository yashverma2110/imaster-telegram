"use strict";
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
dotenv_1.default.config();
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN || '');
bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chat = yield ctx.getChat();
    ctx.reply(`Hi ${chat.first_name}! imaster will help you master IT!`);
    const user = new UserService_1.default();
    const response = yield user.createUser({
        firstName: chat.first_name,
        lastName: chat.last_name,
        telegramId: chat.id,
        isPremium: (_a = chat.is_premium) !== null && _a !== void 0 ? _a : false,
    });
    if (response.success) {
        ctx.reply('You have successfully registered!');
    }
}));
bot.launch();
