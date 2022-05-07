import { RegisterLoginMutationVariables } from './../types/mutations';
import {
  addCommentMutation,
  AddCommentMutationPayload,
  addFavoriteMutation,
  loginMutation,
  registerMutation,
  updateCommentVotesMutation,
  updatePostVotesMutation,
} from '../fetchers/mutations';
import {
  UpdateCommentVotesMutationVariables,
  UpdatePostVotesMutationVariables,
  UpdateUserFavoriteStatusMutationVariables,
} from '../types/mutations';
import { AddCommentMutationVariables } from '../types/mutations';
import { getPostBaseKey, getPostsBaseKey } from './queries';
import { useMutation, useQueryClient } from 'react-query';
import { PostType } from '../../common/types/entities';

export const useRegisterLogin = () =>
  useMutation((variables: RegisterLoginMutationVariables) =>
    variables.email ? registerMutation(variables) : loginMutation(variables)
  );

export const useUpdatePostVotesMutation = (variables: UpdatePostVotesMutationVariables) => {
  const { postId, voteValue, postSlugs } = variables;
  const queryClient = useQueryClient();
  const currentPost = queryClient.getQueryData<PostType>(getPostBaseKey({ postSlugs }));
  const currentPosts = queryClient.getQueryData<PostType[]>(getPostsBaseKey());

  const updatePosts = (posts: PostType[], newPost: PostType) =>
    posts.map((post) => (post.id === newPost.id ? newPost : post));

  return useMutation(() => updatePostVotesMutation({ postId, voteValue }), {
    onSuccess: (resp) => {
      queryClient.setQueryData(getPostBaseKey({ postSlugs }), {
        ...currentPost,
        userVoteStatus: resp.userVoteStatus,
        points: resp.points,
      });
      if (currentPosts) {
        queryClient.setQueryData(getPostsBaseKey(), updatePosts(currentPosts, resp));
      }
    },
  });
};

export const useUpdateCommentVotesMutation = (variables: UpdateCommentVotesMutationVariables) => {
  const { commentId, voteValue, postSlugs } = variables;
  const queryClient = useQueryClient();

  return useMutation(() => updateCommentVotesMutation({ commentId, voteValue }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(getPostBaseKey({ postSlugs }));
    },
  });
};

export const useAddCommentMutation = (variables: AddCommentMutationVariables) => {
  const { postSlugs } = variables;
  const queryClient = useQueryClient();

  return useMutation((payload: AddCommentMutationPayload) => addCommentMutation(payload), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(getPostBaseKey({ postSlugs }));
    },
  });
};

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
