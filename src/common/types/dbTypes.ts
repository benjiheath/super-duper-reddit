export type Table = 'session' | 'users';

export enum DbTables {
  users = 'users',
  posts = 'posts',
  comments = 'comments',
  postsVotes = 'posts_votes',
  commentsVotes = 'comments_votes',
  session = 'session',
}

export type UserColumn = keyof DbUser;
export type PostsColumn = keyof DbPost;
export type CommentsColumn = keyof DbComment;

export interface DbUser {
  id: string;
  username: string;
  email: string;
  password: string;
  created_at: string;
  reset_pw_token: string;
}

export interface DbPost {
  id: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  points: number;
  creator_user_id: string;
  current_status: 'normal' | 'removed';
}

export interface DbComment {
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

export interface DbPostVote {
  id: string;
  post_id: string;
  user_id: string;
  vote_status: number;
}

export interface DbCommentVote {
  id: string;
  comment_id: string;
  user_id: string;
  vote_status: number;
}
