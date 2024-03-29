import { useQuery } from '@tanstack/react-query';
import { PostType } from '../../../common/types';
import { axiosGET } from '../../utils/axiosMethods';

export const getPostBaseKey = (variables: GetPostVariables) => ['post', variables];

interface GetPostVariables {
  postSlugs: string;
}

const getPost = async (variables: GetPostVariables) =>
  await axiosGET<PostType>('posts', { params: variables.postSlugs });

export const usePostQuery = (variables: GetPostVariables) =>
  useQuery(getPostBaseKey(variables), () => getPost(variables), { retry: false });
