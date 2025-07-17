import { User } from './user.interface';

export interface Order {
  id: number;
  userId: number;
  user?: User;
  username?: string;
  date?: string;
  articles: string;
  motif?: string;
  commentaire?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
