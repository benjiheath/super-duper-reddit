import { RegisterLoginMutationVariables } from './../types/mutations';
import { LoginResponse } from './../../common/types/fetching';
import { AddFavoriteMutationResponse, CommentType, PostType } from '../../common/types';
import { axiosDELETE, axiosPATCH, axiosPOST } from '../utils/axiosMethods';

export const registerMutation = async (payload: RegisterLoginMutationVariables) =>
  await axiosPOST<LoginResponse>('user', { data: payload });

export const loginMutation = async (payload: RegisterLoginMutationVariables) =>
  await axiosPOST<LoginResponse>('session', { data: payload });

export const updatePostVotesMutation = async (payload: { postId: string; voteValue: number }) =>
  await axiosPATCH<PostType>('posts/votes', { data: payload });

export const updateCommentVotesMutation = async (payload: { commentId: string; voteValue: number }) =>
  await axiosPATCH<CommentType>('posts/comments/votes', { data: payload });

export interface AddCommentMutationPayload {
  body: string;
  postId: string;
  userId: string;
  username: string;
  parentCommentId: string | null;
}

export const addCommentMutation = async (payload: AddCommentMutationPayload) =>
  await axiosPOST<PostType>('posts/comments', { data: payload });

export const addFavoriteMutation = async (postId: string) =>
  await axiosPOST<AddFavoriteMutationResponse>('posts/favorites', { data: { postId } });

export interface CreatePostMutationPayload {
  userId: string;
  username: string;
  title: string;
  body: string | null;
  contentUrl: string | null;
}

export const createPostMutation = async (payload: CreatePostMutationPayload) =>
  await axiosPOST<string>('posts', { data: payload });

export interface EditPostPayload {
  title: string | null;
  body: string | null;
  contentUrl: string | null;
  postSlugs: string;
}

export const editPostMutation = async (payload: EditPostPayload) =>
  await axiosPATCH<PostType>('posts/post', {
    data: payload,
  });

export const removePostMutation = async (postId: string) => {
  await axiosDELETE('posts', { data: { postId } });
};
