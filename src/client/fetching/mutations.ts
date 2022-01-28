import {
  AddFavoriteMutationResponse,
  CommentType,
  PostType,
  UpdatePostVotesMutationResponse,
} from '../../common/types';
import { axiosPATCH, axiosPOST } from '../utils/axiosMethods';

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
