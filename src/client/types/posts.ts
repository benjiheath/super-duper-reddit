import { DbPost } from '../../common/types/dbTypes';
import { Dispatch } from './general';

export interface PostsDispatchers {
  setPosts: Dispatch<DbPost[] | null>;
}

export interface PostsState {
  posts: DbPost[] | null;
}

export type PostsCtx = PostsDispatchers & PostsState;
export type usePostsCtx = () => PostsCtx;
