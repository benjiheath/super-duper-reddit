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
  const { setPosts } = dispatchers;

  const getAndSetPosts = async () => {
    try {
      const { posts } = await axiosRequest('GET', 'posts');
      setPosts(posts);
    } catch (err) {
      setResponseError(err);
    }
  };

  React.useEffect(() => {
    getAndSetPosts();
  }, []);

  return <PostsContext.Provider value={{ ...state, ...dispatchers }}>{props.children}</PostsContext.Provider>;
};

export const usePostsContext = () => useContext(PostsContext) as PostsCtx;

export default PostsProvider;
