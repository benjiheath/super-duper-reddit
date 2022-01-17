import { useReducer } from 'react';
import { PostsDispatchers, PostsState } from '../../types/posts';
import { initState, PostsActions, postsReducer } from './postsReducer';

const usePostsReducer = (): [PostsState, PostsDispatchers] => {
  const [state, dispatch] = useReducer(postsReducer, initState);

  const dispatchers: PostsDispatchers = {
    setPostsLoading: (value) => {
      dispatch({ type: PostsActions.SET_LOADING, payload: value });
    },
    setPosts: (value) => {
      dispatch({ type: PostsActions.SET_POSTS, payload: value });
    },
    setPostInView: (value) => {
      dispatch({ type: PostsActions.SET_POST_IN_VIEW, payload: value });
    },
    updatePost: (value) => {
      dispatch({ type: PostsActions.UPDATE_POST, payload: value });
    },
  };

  return [state, dispatchers];
};

export default usePostsReducer;
