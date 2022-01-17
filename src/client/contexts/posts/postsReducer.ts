import { PostsState } from '../../types/posts';
import { PostType } from './../../../common/types/entities';

export enum PostsActions {
  SET_POSTS = 'SET_POSTS',
  SET_POST_IN_VIEW = 'SET_POST_IN_VIEW',
  UPDATE_POST = 'UPDATE_POST',
  SET_LOADING = 'SET_LOADING',
}

type ACTIONTYPE =
  | { type: PostsActions.SET_POSTS; payload: PostType[] | null }
  | { type: PostsActions.SET_POST_IN_VIEW; payload: PostType | null }
  | { type: PostsActions.UPDATE_POST; payload: PostType }
  | { type: PostsActions.SET_LOADING; payload: boolean };

export const initState: PostsState = {
  posts: null,
  postInView: null,
  postsLoading: false,
};

export const postsReducer = (state: PostsState, action: ACTIONTYPE) => {
  switch (action.type) {
    case PostsActions.SET_POSTS:
      return { ...state, posts: action.payload };

    case PostsActions.SET_POST_IN_VIEW:
      return { ...state, postInView: action.payload };

    case PostsActions.UPDATE_POST:
      const updatedPosts = state.posts!.map((post) =>
        post.id === action.payload.id ? action.payload : post
      );
      return { ...state, posts: updatedPosts };

    case PostsActions.SET_LOADING:
      return { ...state, postsLoading: action.payload };

    default:
      throw new Error(`Unable to execute action: ${action}`);
  }
};
