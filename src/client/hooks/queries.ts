import { PostType } from '../../common/types';
import { axiosGET } from '../utils/axiosMethods';
import { useFetch } from './useFetch';

export enum Queries {
  getPosts = 'getPosts',
  getPost = 'getPost',
}

export const queries = {
  getPosts: async () => {
    const res = await axiosGET<PostType[]>('posts');
    return res;
  },
  getPost: async (postSlugs: string) => {
    const res = await axiosGET<PostType>('posts/post', { queries: { postSlugs } });
    return res;
  },
};

export const useGetPosts = () => {
  const { data, isLoading, isError } = useFetch(Queries.getPosts);
  return { data, isLoading, isError };
};

export const useGetPost = (postSlugs: string) => {
  const { data, isLoading, isError } = useFetch(Queries.getPost, { postSlugs });
  return { data, isLoading, isError };
};
