import { PostType } from './entities';

export type Endpoint =
  | 'session'
  | 'user'
  | 'posts'
  | 'account'
  | 'account/:token'
  | 'posts/comments'
  | 'user/account';

type Auth = { auth: boolean };

export type FieldErrorData = { field: string; message: string };

export interface FieldErrorResponse {
  message: string;
  errors: FieldErrorData[];
}

export type RegisterResponse = StatusAndMessage & { errors?: FieldErrorData[] };

export type LoginResponse = StatusAndMessage & Auth & { errors?: FieldErrorData[] };

export type RecoveryResponse = StatusAndMessage & { sentTo: string } & { error?: FieldErrorData };

export type PwResetResponse = StatusAndMessage & { username: string };

export type SessionInfo = Auth & { userId: string | null };

export interface StatusAndMessage {
  status: 'fail' | 'success';
  message?: string;
}

export interface ServerResponse extends StatusAndMessage {
  errors?: FieldErrorData[];
  error?: FieldErrorData;
  auth?: boolean;
  sentTo?: string;
  username?: string;
  userId?: string | null;
  post?: PostType;
  posts?: PostType[];
}

export type PostResponse = { post: PostType };
export type PostsResponse = { posts: PostType[] };

export interface GetPostsResponse {
  posts: PostType[];
}

export interface CreatePostResponse {
  status: string;
  post: PostType;
}
