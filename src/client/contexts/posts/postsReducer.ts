import { PostsState } from '../../types/posts';
import { PostWithComments } from './../../../common/types/dbTypes';

export enum PostsActions {
  SET_POSTS = 'SET_POSTS',
}

type ACTIONTYPE = { type: 'SET_POSTS'; payload: PostWithComments[] | null };

export const initState: PostsState = {
  posts: null,
};

export const postsReducer = (state: PostsState, action: ACTIONTYPE) => {
  switch (action.type) {
    case PostsActions.SET_POSTS:
      return { ...state, posts: action.payload };

    default:
      throw new Error(`Unable to execute action: ${action}`);
  }
};
