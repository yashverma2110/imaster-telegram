import axios, { AxiosError } from 'axios';
import { TELEGRAM_API } from '../utils/constants';
import LoggerService from './LoggerService';

const MessageSendService = {
  async sendTextMessage(chatId: number, reply: string, parseMode: string) {
    try {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: reply,
        parse_mode: parseMode,
      });

      LoggerService.success('Message sent successfully', chatId);

      return {
        success: true,
      };
    } catch (error) {
      const err = error as AxiosError;
      LoggerService.error('Unable to send message', err.message);

      return {
        success: false,
      };
    }
  },
};

export default MessageSendService;
