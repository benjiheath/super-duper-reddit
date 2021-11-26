export enum DbTables {
  user = 'user',
  posts = 'posts',
  session = 'session',
}

export enum UserColumns {
  id = 'id',
  username = 'username',
  email = 'email',
  password = 'password',
  resetPwToken = 'resetPwToken',
}

export type UserColumn = 'id' | 'username' | 'email' | 'password' | 'reset_pw_token';

export type Table = 'sessions' | 'users';

export interface UserColumnTypes {
  id: string;
  username: string;
  email: string;
  password: string;
  resetPwToken: string;
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

export interface UserOptions {
  table: DbTables.user;
  columns: Partial<UserColumns>;
}

export interface PostsOptions {
  table: DbTables.posts;
  columns: Partial<PostsColumns>;
}

export type DbTableInsertOptions = UserOptions | PostsOptions;
