import { PostType, CommentType } from '../../common/types';
import { axiosPATCH } from '../utils/axiosMethods';

export const updatePostVotes = async (payload: { id: string; voteValue: number }) => {
  const updatedPost = await axiosPATCH<PostType>('posts/votes', { data: payload });
  return updatedPost;
};

export const updateCommentVotes = async (payload: { id: string; voteValue: number }) => {
  const updatedComment = await axiosPATCH<CommentType>('posts/comments/votes', { data: payload });
  return updatedComment;
};

// export const useUpdatePostVotesMutation = () => (postId: string, voteValue: number) =>
//   useFetch({
//     query: () => updatePostVotes({ id: postId, voteValue }),
//   });

// export const useUpdateCommentVotesMutation = () => (commentId: string, voteValue: number) =>
//   useMutation({
//     mutation: () => updateCommentVotes({ id: commentId, voteValue }),
//   });
