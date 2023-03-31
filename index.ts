import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import MessageReceiveService from './src/services/MessageReceiveService';
import { TELEGRAM_API, URI, WEBHOOK_URL } from './src/utils/constants';

// emit .env
dotenv.config();

const PORT = 8080;

const app = express();
app.use(express.json());

// receive message from telegram
app.post(`/${URI}`, async (req, res) => {
  const { message } = req.body;
  const { text, chat }: { text: string; chat: Chat } = message;

  await MessageReceiveService.receiveMessage(text, chat);

  res.send();
});

const initWebhook = async () => {
  const { data } = await axios.get(
    `${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`
  );
  console.log(data);
};

app.listen(PORT, async () => {
  console.log('Server is running on port', PORT);
  await initWebhook();
});
