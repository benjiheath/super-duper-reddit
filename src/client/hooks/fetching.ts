import { useMutation, useQuery, useQueryClient } from 'react-query';
import { PostType } from '../../common/types/entities';
import {
  addComment,
  AddCommentPayload,
  addFavorite,
  updateCommentVotes,
  updatePostVotes,
} from '../fetching/mutations';
import {
  CreatePostMutationVariables,
  UpdateCommentVotesMutationVariables,
  UpdatePostVotesMutationVariables,
  UpdateUserFavoriteStatusMutationVariables,
} from '../types/mutations';
import { getPost, getPosts } from '../fetching/queries';
import { GetPostVariables } from './../fetching/queries';
import { AddCommentMutationVariables } from './../types/mutations';

export const getPostsBaseKey = () => ['posts'];
export const getPostBaseKey = (variables: GetPostVariables) => ['post', variables];

export const usePostsQuery = () => useQuery(getPostsBaseKey(), getPosts);
export const usePostQuery = (variables: GetPostVariables) =>
  useQuery(getPostBaseKey(variables), () => getPost(variables));

export const useUpdatePostVotesMutation = (variables: UpdatePostVotesMutationVariables) => {
  const { postId, voteValue, postSlugs } = variables;
  const queryClient = useQueryClient();
  const currentPost = queryClient.getQueryData<PostType>(getPostBaseKey({ postSlugs }));
  const currentPosts = queryClient.getQueryData<PostType[]>(getPostsBaseKey());

  const updatePosts = (posts: PostType[], newPost: PostType) =>
    posts.map((post) => (post.id === newPost.id ? newPost : post));

  return useMutation(() => updatePostVotes({ postId, voteValue }), {
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

  return useMutation(() => updateCommentVotes({ commentId, voteValue }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(getPostBaseKey({ postSlugs }));
    },
  });
};

export const useAddCommentMutation = (variables: AddCommentMutationVariables) => {
  const { postSlugs } = variables;
  const queryClient = useQueryClient();

  return useMutation((payload: AddCommentPayload) => addComment(payload), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(getPostBaseKey({ postSlugs }));
    },
  });
};

export const useAddFavoriteMutation = (variables: UpdateUserFavoriteStatusMutationVariables) => {
  const { postSlugs, postId } = variables;
  const queryClient = useQueryClient();
  const currentPost = queryClient.getQueryData<PostType>(getPostBaseKey({ postSlugs }));

  return useMutation(() => addFavorite(postId), {
    onSuccess: (resp) => {
      queryClient.setQueryData(getPostBaseKey({ postSlugs }), {
        ...currentPost,
        userFavoriteStatus: resp.updatedUserFavoriteStatus,
      });
    },
  });
};
