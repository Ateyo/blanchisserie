export interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: string; // "User" or "Admin"
}
