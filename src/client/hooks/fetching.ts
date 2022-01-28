import { GetPostVariables } from './../fetching/queries';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { updateCommentVotes, updatePostVotes } from '../fetching/mutations';
import { getPost, getPosts } from '../fetching/queries';
import { UpdatePostVotesVariables, UpdateCommentVotesVariables } from '../types/mutations';

const getPostsBaseKey = () => ['posts'];
const getPostBaseKey = (variables: GetPostVariables) => ['post', variables];

export const usePostsQuery = () => useQuery(getPostsBaseKey(), getPosts);
export const usePostQuery = (variables: GetPostVariables) =>
  useQuery(getPostBaseKey(variables), () => getPost(variables));

export const useUpdatePostVotesMutation = (variables: UpdatePostVotesVariables) => {
  const { postId, voteValue, postSlugs } = variables;
  const queryClient = useQueryClient();

  return useMutation(() => updatePostVotes({ postId, voteValue }), {
    onSuccess: () => {
      queryClient.invalidateQueries(getPostBaseKey({ postSlugs }));
      queryClient.invalidateQueries(getPostsBaseKey());
    },
  });
};

export const useUpdateCommentVotesMutation = (variables: UpdateCommentVotesVariables) => {
  const { commentId, voteValue, postSlugs } = variables;
  const queryClient = useQueryClient();

  return useMutation(() => updateCommentVotes({ commentId, voteValue }), {
    onSuccess: () => {
      queryClient.invalidateQueries(getPostBaseKey({ postSlugs }));
    },
  });
};
