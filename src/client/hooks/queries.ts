import { useQuery } from 'react-query';
import { GetPostVariables, getPosts, getPost } from '../fetching/queries';

export const getPostsBaseKey = () => ['posts'];
export const getPostBaseKey = (variables: GetPostVariables) => ['post', variables];

export const usePostsQuery = () => useQuery(getPostsBaseKey(), getPosts, { retry: false });
export const usePostQuery = (variables: GetPostVariables) =>
  useQuery(getPostBaseKey(variables), () => getPost(variables));
