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
const axios_1 = __importDefault(require("../utils/axios"));
class UserService {
    constructor() {
        this._token = null;
    }
    getToken() {
        return this._token;
    }
    checkIfUserExists(telegramId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`/user/get/${telegramId}`);
                this._token = response.data.token;
                return {
                    success: true,
                };
            }
            catch (error) {
                return {
                    success: false,
                };
            }
        });
    }
    createUser(user) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post("/user/signup", user);
                this._token = response.data.token;
                return {
                    success: true,
                };
            }
            catch (error) {
                const err = error;
                return {
                    success: false,
                    isDuplicate: ((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 409,
                };
            }
        });
    }
}
exports.default = UserService;
