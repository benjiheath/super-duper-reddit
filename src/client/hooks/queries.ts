import { PostType } from '../../common/types';
import { axiosGET } from '../utils/axiosMethods';
import { useFetch } from './fetcher';

export enum Queries {
  getPosts = 'getPosts',
  getPost = 'getPost',
}

export const queries = {
  getPosts: async (userId: string) => {
    const res = await axiosGET<PostType[]>('posts', { queries: { userId: userId } });
    return res;
  },
  getPost: async (userId: string, postSlugs: string) => {
    const res = await axiosGET<PostType>('posts/post', { queries: { userId, postSlugs } });
    return res;
  },
};

export const useGetPosts = (userId: string) => {
  const { data, isLoading, isError } = useFetch(Queries.getPosts, { userId });
  return { data, isLoading, isError };
};

export const useGetPost = (userId: string, postSlugs: string) => {
  const { data, isLoading, isError } = useFetch(Queries.getPost, { userId, postSlugs });
  return { data, isLoading, isError };
};
