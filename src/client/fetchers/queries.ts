import { PostType } from '../../common/types';
import { axiosGET } from '../utils/axiosMethods';

export const getPosts = async () => await axiosGET<PostType[]>('posts');

export interface GetPostVariables {
  postSlugs: string;
}

export const getPost = async (variables: GetPostVariables) =>
  await axiosGET<PostType>('posts/post', { queries: { postSlugs: variables.postSlugs } });
