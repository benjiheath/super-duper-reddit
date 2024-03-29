import { RequireOnlyOne, UpdateCommentsVotesRequest, UpdatePostVotesRequest } from '../../common/types';

export type Table = 'session' | 'users';

export interface DbUser {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  resetPwToken: string;
  points: number;
}

export interface DbPost {
  id: string;
  title: string;
  body: string;
  contentUrl: string | null;
  createdAt: string;
  updatedAt: string;
  createdAtRelative: string;
  creatorUserId: string;
  creatorUsername: string;
  currentStatus: 'normal' | 'removed';
  urlSlugs: string;
  commentCount: number;
  userVoteStatus: -1 | 1 | null;
  userFavoriteStatus: string | null;
  points: number | null;
}

export interface DbComment {
  id: string;
  postId: string;
  parentCommentId: string | null;
  body: string;
  createdAt: string;
  updatedAt: string;
  createdAtRelative: string;
  creatorUserId: string;
  creatorUsername: string;
  currentStatus: 'normal' | 'removed';
  userVoteStatus: -1 | 1 | null;
  points: number | null;
}
export interface DbPostFavorite {
  id: string;
  postId: string;
  userId: string;
}

export interface DbPostVote {
  id: string;
  postId: string;
  userId: string;
  voteStatus: 1 | -1;
}

export interface DbCommentVote {
  id: string;
  commentId: string;
  userId: string;
  voteStatus: 1 | -1;
}

export enum DbTables {
  users = 'users',
  posts = 'posts',
  comments = 'comments',
  postsFavorites = 'posts_favorites',
  postsVotes = 'posts_votes',
  commentsVotes = 'comments_votes',
  session = 'session',
}

export type UserColumn = keyof DbUser;
export type PostsColumn = keyof DbPost;
export type CommentsColumn = keyof DbComment;
export type PostsFavoriteColumn = keyof DbPostFavorite;
export type PostsVoteColumn = keyof DbPostVote;
export type CommentsVoteColumn = keyof DbCommentVote;

export type DbColumnType =
  | UserColumn
  | CommentsColumn
  | PostsColumn
  | PostsFavoriteColumn
  | PostsVoteColumn
  | CommentsVoteColumn;

export type GetPostDto = {
  userId: string;
  postId?: string;
  postSlugs?: string;
};

export type CreatePostDto = {
  userId: string;
  username: string;
  contentUrl: string;
  title: string;
  body: string;
};

export interface EditPostDto extends CreatePostDto {
  postSlugs: string;
}

export type AddCommentToPostDto = {
  body: string;
  postId: string;
  userId: string;
  username: string;
  parentCommentId?: string;
};

export interface CreateDbUserDto {
  username: string;
  password: string;
  email: string;
}
export interface EditDbUserDto {
  username?: string;
  password?: string;
  email?: string;
  resetPwToken?: string;
}

export interface UpdatePostVotesDto extends UpdatePostVotesRequest {
  userId: string;
}

export interface UpdateCommentVotesDto extends UpdateCommentsVotesRequest {
  userId: string;
}

export type GetUserDto = RequireOnlyOne<Omit<DbUser, 'createdAt'>>;

export type CheckIdentifierDto = Omit<CreateDbUserDto, 'password'>;

export type IdentifierCheckResult = keyof Omit<CreateDbUserDto, 'password'>;
