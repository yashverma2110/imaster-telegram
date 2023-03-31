import { AxiosError } from "axios";
import ApiClient from "../utils/axios";

export const UserService = {
  async checkIfUserExists(telegramId: number) {
    try {
      const response = await ApiClient.get(`/user/get/${telegramId}`);

      return {
        success: true,
        token: response.data.token,
      };
    } catch (error: any) {
      console.log(
        '🚀 ~ file: UserService.ts:23 ~ checkIfUserExists ~ error:',
        error
      );
      return {
        success: false,
      };
    }
  },

  async createUser(user: User) {
    try {
      const response = await ApiClient.post('/user/signup', user);
      console.log(
        '🚀 ~ file: UserService.ts:37 ~ createUser ~ response:',
        response
      );

      return {
        success: true,
        token: response.data.token,
      };
    } catch (error) {
      const err = error as AxiosError;

      return {
        success: false,
        isDuplicate: err.response?.status === 409,
      };
    }
  },

  async getAllTopics() {
    try {
      const response = await ApiClient.get('/topic/all');

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

  async subscribeToTopic(topicShortName: string, token: string) {
    try {
     const response = await ApiClient.post(
       '/user/subscribe',
       {
         topic: topicShortName,
       },
       {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       }
     );
     console.log(
       '🚀 ~ file: UserService.ts:82 ~ subscribeToTopic ~ response:',
       response.data
     );

     return {
       success: true,
       data: response.data,
     };
    } catch (error) {
      const err = error as AxiosError;
      console.log(
        '🚀 ~ file: UserService.ts:61 ~ UserService ~ getAllTopics ~ err:',
        err
      );

      return {
        success: false,
        isTopicNotFound: err.response?.status === 404,
        isAlreadySubscribed: err.response?.status === 409,
      };
    }
  },
};

export default UserService;
