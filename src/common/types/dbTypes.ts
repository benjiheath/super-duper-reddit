export type Table = 'session' | 'users';

export enum DbTables {
  users = 'users',
  threads = 'threads',
  posts = 'posts',
  threadsVotes = 'threads_votes',
  postsVotes = 'posts_votes',
  session = 'session',
}

export type UserColumn = keyof UserColumns;
export type ThreadsColumn = keyof ThreadsColumns;
export type PostsColumn = keyof PostsColumns;

export interface UserColumns {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: string;
  reset_pw_token: string;
}

export interface ThreadsColumns {
  id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  points: number;
  creator_user_id: string;
}

export interface PostsColumns {
  id: string;
  user_id: string;
  thread_id: string;
  parent_post_id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  points: number;
  creator_user_id: string;
}

export interface ThreadsVotesColumns {
  id: string;
  thread_id: string;
  user_id: string;
  vote_status: number;
}

export interface PostsVotesColumns {
  id: string;
  posts_id: string;
  user_id: string;
  vote_status: number;
}
