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
  creatorUserId: string;
  creatorUsername: string;
  currentStatus: 'normal' | 'removed';
  urlSlugs: string;
  comments: CommentType[];
}

export interface CommentType {
  id: string;
  postId: string;
  parentPostId: string | null;
  body: string;
  createdAt: string;
  updatedAt: string;
  creatorUserId: string;
  creatorUsername: string;
  currentStatus: 'normal' | 'removed';
}
