import { PostType, CommentType } from '../../common/types/entities';
import { Dispatch } from './general';

export interface PostsDispatchers {
  setPostsLoading: Dispatch<boolean>;
  setPosts: Dispatch<PostType[] | null>;
  setPostInView: Dispatch<PostType | null>;
  updatePost: Dispatch<PostType>;
}

export interface PostsState {
  posts: PostType[] | null;
  postInView: PostType | null;
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

export type CreatePostFields = Pick<PostType, 'title' | 'body' | 'contentUrl'>;
export type CreateCommentFields = Pick<CommentType, 'body'>;
