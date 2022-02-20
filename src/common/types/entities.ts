export interface UserType {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  resetPwToken: string;
  points: number;
}

export interface PostType {
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
  comments: NestedComment[];
  commentCount: number;
  userVoteStatus: -1 | 1 | null;
  userFavoriteStatus: boolean;
  points: number | null;
}

export interface CommentType {
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
  children: NestedComment[];
}

export interface NestedComment extends CommentType {
  children: NestedComment[];
}

export interface PostFavoriteType {
  id: string;
  postId: string;
  userId: string;
}

export interface PostVoteType {
  id: string;
  postId: string;
  userId: string;
  voteStatus: 1 | -1;
}

export interface CommentVoteType {
  id: string;
  commentId: string;
  userId: string;
  voteStatus: 1 | -1;
}
