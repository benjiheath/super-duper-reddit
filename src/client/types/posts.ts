import { PostWithComments } from './../../common/types/dbTypes';
import { Dispatch } from './general';

export interface PostsDispatchers {
  setPosts: Dispatch<PostWithComments[] | null>;
}

export interface PostsState {
  posts: PostWithComments[] | null;
}

export type PostsCtx = PostsDispatchers & PostsState;
export type usePostsCtx = () => PostsCtx;

export interface PostProps {
  post: PostWithComments;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  contentUrl: string;
  createdAt: string;
  updatedAt: string;
  creatorUserID: string;
  creatorUsername: string;
  currentStatus: 'normal' | 'removed';
  urlSlugs: string;
}

export interface Comment {
  id: string;
  postID: string;
  parentPostID: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  creatorUserID: string;
  creatorUsername: string;
  currentStatus: 'normal' | 'removed';
}

export type CreatePostFields = Pick<Post, 'title' | 'body'>;
export type CreateCommentFields = Pick<Comment, 'body'>;
