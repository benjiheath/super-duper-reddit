import { PostType, CommentType } from '../../common/types/entities';
import { PostWithComments } from '../../server/types/dbTypes';
import { Dispatch } from './general';

export interface PostsDispatchers {
  setPostsLoading: Dispatch<boolean>;
  setPosts: Dispatch<PostType[] | null>;
  setPost: Dispatch<PostType | null>;
  updatePost: Dispatch<PostType>;
}

export interface PostsState {
  posts: PostType[] | null;
  post: PostType | null;
  postsLoading: boolean;
}

export type PostsCtx = PostsDispatchers &
  PostsState & { getAndSetPosts: () => Promise<void> } & {
    getPost: (postSlugs: string) => Promise<void>;
  };
export type usePostsCtx = () => PostsCtx;

export interface PostProps {
  post: PostType;
}

export type CreatePostFields = Pick<PostType, 'title' | 'body'>;
export type CreateCommentFields = Pick<CommentType, 'body'>;
