import React, { createContext, useContext } from 'react';
import { ProviderProps } from '../../types/general';
import usePostsReducer from './usePostsReducer';

export const PostsContext = createContext<any>(null);

const PostsProvider = (props: ProviderProps) => {
  const [state, dispatchers] = usePostsReducer();

  return <PostsContext.Provider value={{ ...state, ...dispatchers }}>{props.children}</PostsContext.Provider>;
};

export const usePostsContext = () => useContext(PostsContext);

export default PostsProvider;
