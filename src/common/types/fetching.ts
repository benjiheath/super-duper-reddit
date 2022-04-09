import { DbColumnType } from '../../server/database/database.types';
import { PostType } from './entities';

export type Endpoint =
  | 'session'
  | 'user'
  | 'posts'
  | 'posts/post'
  | 'account'
  | 'account/:token'
  | 'posts/comments'
  | 'posts/comments/votes'
  | 'posts/favorites'
  | 'posts/votes'
  | 'user/account';

type Auth = { auth: boolean };

export type FieldError = { field: DbColumnType; message: string };

export interface FieldErrorResponse {
  message: string;
  errors: FieldError[];
}

export type RegisterResponse = StatusAndMessage & { errors?: FieldError[] };

export type LoginResponse = StatusAndMessage & Auth & { errors?: FieldError[] };

export type RecoveryResponse = StatusAndMessage & { sentTo: string } & { error?: FieldError };

export type PwResetResponse = StatusAndMessage & { username: string };

export type SessionInfo = Auth & { userId: string | null };

export interface StatusAndMessage {
  status: 'fail' | 'success';
  message?: string;
}

export interface ServerResponse extends StatusAndMessage {
  errors?: FieldError[];
  error?: FieldError;
  auth?: boolean;
  sentTo?: string;
  username?: string;
  userId?: string | null;
  post?: PostType;
  posts?: PostType[];
  updatedUserFavoriteStatus?: boolean;
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

export type UpdatePostVotesMutationResponse = Pick<PostType, 'userVoteStatus' | 'points'>;

export interface AddFavoriteMutationResponse {
  updatedUserFavoriteStatus: boolean;
}
