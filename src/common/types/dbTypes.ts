export type Table = 'session' | 'users';

export enum DbTables {
  users = 'users',
  posts = 'posts',
  comments = 'comments',
  postsVotes = 'posts_votes',
  commentsVotes = 'comments_votes',
  session = 'session',
}

export type UserColumn = keyof UserColumns;
export type PostsColumn = keyof PostsColumns;
export type CommentsColumn = keyof CommentsColumns;

export interface UserColumns {
  id: string;
  username: string;
  email: string;
  password: string;
  created_at: string;
  reset_pw_token: string;
}

export interface PostsColumns {
  id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  points: number;
  creator_user_id: string;
  current_status: 'normal' | 'removed';
}

export interface CommentsColumns {
  id: string;
  post_id: string;
  parent_post_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  points: number;
  creator_user_id: string;
  current_status: 'normal' | 'removed';
}

export interface PostsVotesColumns {
  id: string;
  post_id: string;
  user_id: string;
  vote_status: number;
}

export interface CommentsVotesColumns {
  id: string;
  comment_id: string;
  user_id: string;
  vote_status: number;
}
