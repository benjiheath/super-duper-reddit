import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddPostFavoriteRequest, AddPostFavoriteResponse, PostType } from '../../../common/types';
import { axiosPOST } from '../../utils/axiosMethods';
import { getPostBaseKey } from '../queries/usePostQuery';

interface UpdateUserFavoriteStatusMutationVariables {
  postId: string;
  postSlugs: string;
}

const addFavoriteMutation = async (request: AddPostFavoriteRequest) =>
  await axiosPOST<AddPostFavoriteResponse>('posts/favorites', { data: request });

export const useAddFavoriteMutation = (variables: UpdateUserFavoriteStatusMutationVariables) => {
  const { postSlugs, postId } = variables;
  const queryClient = useQueryClient();
  const currentPost = queryClient.getQueryData<PostType>(getPostBaseKey({ postSlugs }));

  return useMutation(() => addFavoriteMutation({ postId }), {
    onSuccess: (resp) => {
      queryClient.setQueryData(getPostBaseKey({ postSlugs }), {
        ...currentPost,
        userFavoriteStatus: resp.updatedUserFavoriteStatus,
      });
    },
  });
};
