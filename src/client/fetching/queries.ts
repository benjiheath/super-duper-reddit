import { PostType } from '../../common/types';
import { axiosGET } from '../utils/axiosMethods';

export const getPosts = async () => await axiosGET<PostType[]>('posts');

export const getPost = async (postSlugs: string) =>
  await axiosGET<PostType>('posts/post', { queries: { postSlugs } });
