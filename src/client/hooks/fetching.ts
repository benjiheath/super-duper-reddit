import { useQuery, useMutation, useQueryClient } from 'react-query';
import { updateCommentVotes, updatePostVotes } from '../fetching/mutations';
import { getPost, getPosts } from '../fetching/queries';

export const usePostsQuery = () => useQuery('posts', getPosts);
export const usePostQuery = (postSlugs: string) => useQuery('post', () => getPost(postSlugs));

export const useUpdatePostVotesMutation = (postId: string, voteValue: number) => {
  const queryClient = useQueryClient();

  return useMutation(() => updatePostVotes({ postId, voteValue }), {
    onSuccess: () => {
      queryClient.invalidateQueries('post');
    },
  });
};

export const useUpdateCommentVotesMutation = (commentId: string, voteValue: number) => {
  const queryClient = useQueryClient();

  return useMutation(() => updateCommentVotes({ commentId, voteValue }), {
    onSuccess: () => {
      queryClient.invalidateQueries('post');
    },
  });
};
