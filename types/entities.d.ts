interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  username: string;
  telegramId: number;
  isPremium: boolean;
}

interface Topic {
  _id: string;
  name: string;
  shortName: string;
  user?: string;
  createdAt: string;
  updatedAt: string;
}
