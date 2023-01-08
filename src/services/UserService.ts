import { AxiosError } from "axios";
import ApiClient from "../utils/axios";

type User = {
  firstName: string;
  lastName: string;
  username: string;
  telegramId: number;
  isPremium: boolean;
};
class UserService {
  private _token: string | null = null;

  getToken() {
    return this._token;
  }

  async checkIfUserExists(telegramId: number) {
    try {
      const response = await ApiClient.get(`/user/get/${telegramId}`);
      this._token = response.data.token;

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  }

  async createUser(user: User) {
    try {
      const response = await ApiClient.post("/user/signup", user);
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
