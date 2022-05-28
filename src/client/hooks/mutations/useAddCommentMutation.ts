import { useMutation, useQueryClient } from 'react-query';
import { PostType } from '../../../common/types';
import { axiosPOST } from '../../utils/axiosMethods';
import { getPostBaseKey } from '../queries/usePostQuery';

interface AddCommentMutationVariables {
  postSlugs: string;
}

interface AddCommentMutationPayload {
  body: string;
  postId: string;
  userId: string;
  username: string;
  parentCommentId: string | null;
}

const addCommentMutation = async (payload: AddCommentMutationPayload) =>
  await axiosPOST<PostType>('posts/comments', { data: payload });

export const useAddCommentMutation = (variables: AddCommentMutationVariables) => {
  const { postSlugs } = variables;
  const queryClient = useQueryClient();

  return useMutation((payload: AddCommentMutationPayload) => addCommentMutation(payload), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(getPostBaseKey({ postSlugs }));
    },
  });
};
