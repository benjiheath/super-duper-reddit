import { PostType } from '../../common/types';
import { axiosGET } from '../utils/axiosMethods';

export const getPosts = async () => await axiosGET<PostType[]>('posts');

export const getPost = async (postSlugs: string) =>
  await axiosGET<PostType>('posts/post', { queries: { postSlugs } });

// with fetch
// const fetch = async <A>(fetchFn: () => Promise<A>) => {
//   try {
//     return await fetchFn();
//   } catch (err) {
//     throw err;
//   }
// };

// // export const getPosts = async () => await axiosGET<PostType[]>('posts');
// export const getPosts = () => fetch(() => axiosGET<PostType[]>('posts'));
// export const getPost = (postSlugs: string) =>
//   fetch(() => axiosGET<PostType>('posts/post', { queries: { postSlugs } }));
