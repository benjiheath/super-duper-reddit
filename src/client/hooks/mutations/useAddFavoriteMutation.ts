import { useMutation, useQueryClient } from 'react-query';
import { AddFavoriteMutationResponse, PostType } from '../../../common/types';
import { axiosPOST } from '../../utils/axiosMethods';
import { getPostBaseKey } from '../queries/usePostQuery';

interface UpdateUserFavoriteStatusMutationVariables {
  postId: string;
  postSlugs: string;
}

const addFavoriteMutation = async (postId: string) =>
  await axiosPOST<AddFavoriteMutationResponse>('posts/favorites', { data: { postId } });

export const useAddFavoriteMutation = (variables: UpdateUserFavoriteStatusMutationVariables) => {
  const { postSlugs, postId } = variables;
  const queryClient = useQueryClient();
  const currentPost = queryClient.getQueryData<PostType>(getPostBaseKey({ postSlugs }));

  return useMutation(() => addFavoriteMutation(postId), {
    onSuccess: (resp) => {
      queryClient.setQueryData(getPostBaseKey({ postSlugs }), {
        ...currentPost,
        userFavoriteStatus: resp.updatedUserFavoriteStatus,
      });
    },
  });
};
