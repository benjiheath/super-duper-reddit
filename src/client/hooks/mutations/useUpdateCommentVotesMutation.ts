import { useMutation, useQueryClient } from 'react-query';
import { CommentType } from '../../../common/types';
import { axiosPATCH } from '../../utils/axiosMethods';
import { getPostBaseKey } from '../queries/usePostQuery';

interface UpdateCommentVotesMutationVariables {
  postSlugs: string;
  commentId: string;
  voteValue: number;
}

const updateCommentVotesMutation = async (payload: { commentId: string; voteValue: number }) =>
  await axiosPATCH<CommentType>('posts/comments/votes', { data: payload });

export const useUpdateCommentVotesMutation = (variables: UpdateCommentVotesMutationVariables) => {
  const { commentId, voteValue, postSlugs } = variables;
  const queryClient = useQueryClient();

  return useMutation(() => updateCommentVotesMutation({ commentId, voteValue }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(getPostBaseKey({ postSlugs }));
    },
  });
};
