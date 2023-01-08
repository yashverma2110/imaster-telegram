"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
// middlwares
app.use((0, cors_1.default)({
    origin: '*',
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.get('/', (req, res) => {
    res.send('[server]: imasterit Telegram bot ready to use');
});
app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});
