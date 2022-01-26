import { PostType } from '../../common/types';
import { axiosGET } from '../utils/axiosMethods';
import { useFetch } from './useFetch';

const getPosts = async () => await axiosGET<PostType[]>('posts');

const getPost = async (postSlugs: string) =>
  await axiosGET<PostType>('posts/post', { queries: { postSlugs } });

export const usePostsQuery = () => useFetch({ query: getPosts });
export const usePostQuery = (postSlugs: string) => useFetch({ query: () => getPost(postSlugs) });
