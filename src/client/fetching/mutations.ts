import { AddFavoriteMutationResponse, CommentType, PostType } from '../../common/types';
import { axiosDELETE, axiosPATCH, axiosPOST } from '../utils/axiosMethods';

export const updatePostVotes = async (payload: { postId: string; voteValue: number }) =>
  await axiosPATCH<PostType>('posts/votes', { data: payload });

export const updateCommentVotes = async (payload: { commentId: string; voteValue: number }) =>
  await axiosPATCH<CommentType>('posts/comments/votes', { data: payload });

export interface AddCommentPayload {
  body: string;
  postId: string;
  creatorUserId: string;
  creatorUsername: string;
  parentCommentId: string | null;
}

export const addComment = async (payload: AddCommentPayload) =>
  await axiosPOST<PostType>('posts/comments', { data: payload });

export const addFavorite = async (postId: string) =>
  await axiosPOST<AddFavoriteMutationResponse>('posts/favorites', { data: { postId } });

export interface CreatePostPayload {
  creatorUserId: string;
  creatorUsername: string;
  title: string;
  body: string | null;
  contentUrl: string | null;
}

export const createPost = async (payload: CreatePostPayload) =>
  await axiosPOST<PostType>('posts', { data: payload });

export interface EditPostPayload {
  title: string | null;
  body: string | null;
  contentUrl: string | null;
  postSlugs: string;
}

export const editPost = async (payload: EditPostPayload) =>
  await axiosPATCH<PostType>('posts/post', {
    data: payload,
  });

export const removePost = async (postId: string) => {
  await axiosDELETE('posts', { data: { postId } });
};
