import { AxiosError } from "axios";
import ApiClient from "../utils/axios";
import LoggerService from './LoggerService';

export const UserService = {
  async checkIfUserExists(telegramId: number) {
    try {
      const response = await ApiClient.get(`/user/get/${telegramId}`);
      LoggerService.success('user exists', telegramId);
      return {
        success: true,
        token: response.data.token,
      };
    } catch (error: any) {
      LoggerService.error(
        '🚀 ~ file: UserService.ts:23 ~ checkIfUserExists ~ error:',
        error.message
      );
      return {
        success: false,
      };
    }
  },

  async createUser(user: User) {
    try {
      const response = await ApiClient.post('/user/signup', user);
      LoggerService.success('user created successfully', user.telegramId);

      return {
        success: true,
        token: response.data.token,
      };
    } catch (error) {
      const err = error as AxiosError;
      LoggerService.error('user creation failed', err.message);

      return {
        success: false,
        isDuplicate: err.response?.status === 409,
      };
    }
  },

  async getAllTopics() {
    try {
      const response = await ApiClient.get('/topic/all');
      LoggerService.success('topics fetched successfully');

      return {
        success: true,
        topics: response.data.topics,
      };
    } catch (error) {
      const err = error as AxiosError;
      console.log(
        '🚀 ~ file: UserService.ts:61 ~ UserService ~ getAllTopics ~ err:',
        err
      );

      return {
        success: false,
        err,
      };
    }
  },

  async subscribeToTopic(topicShortName: string, chatId: number) {
    try {
      const response = await ApiClient.post(
        '/user/subscribe',
        {
          topic: topicShortName,
        },
        {
          headers: {
            Authorization: `Bearer ${chatId}`,
          },
        }
      );
      LoggerService.success('user subscribed to topic successfully');

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const err = error as AxiosError;
      LoggerService.error('Unable to subscribe to topic', topicShortName);

      return {
        success: false,
        isTopicNotFound: err.response?.status === 404,
        isAlreadySubscribed: err.response?.status === 409,
      };
    }
  },
};

export default UserService;
