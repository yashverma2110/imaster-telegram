import { AxiosError } from 'axios';
import ApiClient from '../utils/axios';

type User = {
  firstName: string;
  lastName: string;
  telegramId: number;
  isPremium: boolean;
};
class UserService {
  private _token: string | null = null;

  async createUser(user: User) {
    try {
      const response = await ApiClient.post('/user/signup', user);
      this._token = response.data.token;

      return {
        success: true,
      };
    } catch (error) {
      const err = error as AxiosError;
      return {
        success: false,
        isDuplicate: err.response?.status === 409,
      };
    }
  }
}

export default UserService;
