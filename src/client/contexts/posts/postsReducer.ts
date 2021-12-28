import { DbPost } from '../../../common/types/dbTypes';
import { PostsState } from '../../types/posts';

export enum PostsActions {
  SET_POSTS = 'SET_POSTS',
}

type ACTIONTYPE = { type: 'SET_POSTS'; payload: DbPost[] | null };

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
