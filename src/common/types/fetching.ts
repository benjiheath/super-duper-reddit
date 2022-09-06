import { UserType } from './entities';
import { DbColumnType } from '../../server/database/database.types';
import { RequireOnlyOne } from './utils';

export type Endpoint =
  | 'session'
  | 'user'
  | 'posts'
  | 'account'
  | 'account/:token'
  | 'posts/comments'
  | 'posts/comments/votes'
  | 'posts/favorites'
  | 'posts/votes'
  | 'user/account';

export type FieldError = { field: DbColumnType; message: string };

export interface GetPostRequest {
  slugs: string;
}

export type CreatePostRequest = {
  title: string;
  body: string;
  contentUrl: string;
};

export interface EditPostRequest extends CreatePostRequest {
  postSlugs: string;
}

export interface AddCommentRequest {
  postId: string;
  body: string;
  parentCommentId?: string;
}

export type UpdateCommentsVotesRequest = {
  voteValue: 1 | -1;
  commentId: string;
};

export type UpdatePostVotesRequest = {
  voteValue: 1 | -1;
  postId: string;
};

export type AddPostFavoriteRequest = {
  postId: string;
};

export type RemovePostRequest = {
  postId: string;
};

export interface PasswordResetRequest {
  newPassword: string;
  token: string;
}

export interface AddPostFavoriteResponse {
  updatedUserFavoriteStatus: boolean;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export type ForgotPasswordRequest = RequireOnlyOne<Pick<UserType, 'username' | 'email'>>;

export interface LoginResponse {
  status: string;
  userId: string;
  username: string;
}
