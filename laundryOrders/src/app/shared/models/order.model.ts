export interface Order {
  id: number;
  userId: number;
  user?: any; // Or define a User interface if needed
  username?: string;
  date?: Date;
  articles: string;
  motif?: string;
  commentaire?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
