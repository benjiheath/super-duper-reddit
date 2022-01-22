import { PostType } from '../../common/types';
import { axiosGET } from '../utils/axiosMethods';
import { useFetch } from './useFetch';

const getPosts = async () => await axiosGET<PostType[]>('posts');

const getPost = async (postSlugs: string) =>
  await axiosGET<PostType>('posts/post', { queries: { postSlugs } });

export const useGetPostsQuery = () => useFetch({ query: getPosts });
export const useGetPostQuery = (postSlugs: string) => useFetch({ query: () => getPost(postSlugs) });
