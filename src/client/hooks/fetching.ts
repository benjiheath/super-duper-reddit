import { useQuery } from 'react-query';
import { getPost, getPosts } from '../fetching/queries';

export const usePostsQuery = () => useQuery('posts', getPosts);
export const usePostQuery = (postSlugs: string) => useQuery('post', () => getPost(postSlugs));
