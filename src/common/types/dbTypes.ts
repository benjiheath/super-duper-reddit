export type Table = 'sessions' | 'users';

export enum DbTables {
  users = 'users',
  posts = 'posts',
  session = 'session',
}

export type UserColumn = keyof UserColumns;
export type PostsColumn = keyof PostsColumns;

export interface UserColumns {
  id: number;
  username: string;
  email: string;
  password: string;
  reset_pw_token: string;
}

export interface PostsColumns {
  id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  points: number;
  creator: string;
}
