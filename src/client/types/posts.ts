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
