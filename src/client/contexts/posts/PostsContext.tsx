import React, { createContext, useContext } from 'react';
import { PostType } from '../../../common/types/entities';
import { ProviderProps } from '../../types/general';
import { PostsCtx } from '../../types/posts';
import { axiosGET } from '../../utils/axiosMethods';
import { useGlobalUserContext } from '../user/GlobalUserContext';
import usePostsReducer from './usePostsReducer';

export const PostsContext = createContext<PostsCtx | null>(null);

const PostsProvider = (props: ProviderProps) => {
  const [state, dispatchers] = usePostsReducer();
  const { setResponseError } = useGlobalUserContext();
  const { setPosts, setPostsLoading, setPost } = dispatchers;

  const getPostsOrPost = async (postSlugs?: string) => {
    try {
      setPostsLoading(true);
      const res = postSlugs
        ? await axiosGET<PostType>('posts', undefined, postSlugs)
        : await axiosGET<PostType[]>('posts');
      setPostsLoading(false);

      if (!res) {
        setResponseError('error fetching resource');
        return;
      }

      postSlugs ? setPost(res as PostType) : setPosts(res as PostType[]);
    } catch (err) {
      setResponseError(err);
    }
  };

  const getAndSetPosts = async () => {
    await getPostsOrPost();
  };

  const getPost = async (postSlugs: string) => {
    await getPostsOrPost(postSlugs);
  };

  return (
    <PostsContext.Provider value={{ ...state, ...dispatchers, getAndSetPosts, getPost }}>
      {props.children}
    </PostsContext.Provider>
  );
};

export const usePostsContext = () => useContext(PostsContext) as PostsCtx;

export default PostsProvider;
