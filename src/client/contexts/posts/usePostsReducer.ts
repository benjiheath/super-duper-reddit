import { useReducer } from 'react';
import { PostsDispatchers, PostsState } from '../../types/posts';
import { initState, PostsActions, postsReducer } from './postsReducer';

const usePostsReducer = (): [PostsState, PostsDispatchers] => {
  const [state, dispatch] = useReducer(postsReducer, initState);

  const dispatchers: PostsDispatchers = {
    setPosts: value => {
      dispatch({ type: PostsActions.SET_POSTS, payload: value });
    },
    updatePost: value => {
      dispatch({ type: PostsActions.UPDATE_POST, payload: value });
    },
  };

  return [state, dispatchers];
};

export default usePostsReducer;
