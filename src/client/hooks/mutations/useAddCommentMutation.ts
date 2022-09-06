import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddCommentRequest, PostType } from '../../../common/types';
import { axiosPOST } from '../../utils/axiosMethods';
import { getPostBaseKey } from '../queries/usePostQuery';

interface AddCommentMutationVariables {
  postSlugs: string;
}

const addCommentMutation = async (payload: AddCommentRequest) =>
  await axiosPOST<PostType>('posts/comments', { data: payload });

export const useAddCommentMutation = (variables: AddCommentMutationVariables) => {
  const { postSlugs } = variables;
  const queryClient = useQueryClient();

  return useMutation((payload: AddCommentRequest) => addCommentMutation(payload), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(getPostBaseKey({ postSlugs }));
    },
  });
};
