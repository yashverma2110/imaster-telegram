import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// middlwares
app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json({ limit: '10mb' }));

app.get('/', (req: Request, res: Response) => {
  res.send('[server]: imasterit Telegram bot ready to use');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
