import { PostType, CommentType } from '../../common/types';
import { axiosPATCH } from '../utils/axiosMethods';

export const updatePostVotes = async (payload: { postId: string; voteValue: number }) =>
  await axiosPATCH<PostType>('posts/votes', { data: payload });

export const updateCommentVotes = async (payload: { commentId: string; voteValue: number }) =>
  await axiosPATCH<CommentType>('posts/comments/votes', { data: payload });
