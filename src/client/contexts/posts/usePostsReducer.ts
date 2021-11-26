import { useReducer } from 'react';
import { initState, postsReducer } from './postsReducer';

const usePostsReducer = (): any => {
  const [state, dispatch] = useReducer(postsReducer, initState);

  const dispatchers = {
    setPosts: (value: any) => {
      dispatch({ type: 'SET_POSTS', payload: value });
    },
  };

  return [state, dispatchers];
};

export default usePostsReducer;
