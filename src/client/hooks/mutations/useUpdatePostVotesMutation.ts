import { useQueryClient, useMutation } from 'react-query';
import { PostType } from '../../../common/types';
import { axiosPATCH } from '../../utils/axiosMethods';
import { getPostBaseKey } from '../queries/usePostQuery';
import { getPostsBaseKey } from '../queries/usePostsQuery';

interface UpdatePostVotesMutationVariables {
  postSlugs: string;
  postId: string;
  voteValue: number;
}

const updatePostVotesMutation = async (payload: { postId: string; voteValue: number }) =>
  await axiosPATCH<PostType>('posts/votes', { data: payload });

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
