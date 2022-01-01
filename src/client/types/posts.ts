import { PostType, CommentType } from '../../common/types/entities';
import { PostWithComments } from '../../server/types/dbTypes';
import { Dispatch } from './general';

export interface PostsDispatchers {
  setPosts: Dispatch<PostType[] | null>;
  updatePost: Dispatch<PostType>;
}

export interface PostsState {
  posts: PostType[] | null;
}

export type PostsCtx = PostsDispatchers & PostsState;
export type usePostsCtx = () => PostsCtx;

export interface PostProps {
  post: PostType;
}

export type CreatePostFields = Pick<PostType, 'title' | 'body'>;
export type CreateCommentFields = Pick<CommentType, 'body'>;
