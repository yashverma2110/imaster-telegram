import dotenv from 'dotenv';

dotenv.config();

const { BOT_TOKEN, SERVER_URL } = process.env;

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const URI = `webhook/${BOT_TOKEN}`;
const WEBHOOK_URL = `${SERVER_URL}/${URI}`;

export { TELEGRAM_API, URI, WEBHOOK_URL };
