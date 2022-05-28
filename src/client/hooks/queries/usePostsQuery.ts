import { useQuery } from 'react-query';
import { PostType } from '../../../common/types';
import { axiosGET } from '../../utils/axiosMethods';

export const getPostsBaseKey = () => ['posts'];

const getPosts = async () => await axiosGET<PostType[]>('posts');
export const usePostsQuery = () => useQuery(getPostsBaseKey(), getPosts, { retry: false });
