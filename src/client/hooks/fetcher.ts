import { useEffect, useReducer } from 'react';
import { PostType } from '../../common/types';
import { Queries, queries } from './queries';

enum FetchActions {
  FETCH_INIT = 'FETCH_INIT',
  FETCH_SUCCESS = 'FETCH_SUCCESS',
  FETCH_FAILURE = 'FETCH_FAILURE',
}

type ACTIONTYPE<T> =
  | { type: FetchActions.FETCH_INIT }
  | { type: FetchActions.FETCH_SUCCESS; payload: T }
  | { type: FetchActions.FETCH_FAILURE };

interface FetchState<T> {
  isLoading: boolean;
  isError: boolean;
  data: T | null;
}

const initState = {
  isLoading: false,
  isError: false,
  data: null,
};

const fetchReducer = (state: FetchState<any>, action: ACTIONTYPE<any>) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, isError: false };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, isError: false, data: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, isError: true };
    default:
      throw new Error();
  }
};

interface Options {
  userId: string;
  postSlugs?: string;
}

type useFetchOverload = {
  (queryType: Queries.getPosts, options: Options): FetchState<PostType[]>;
  (queryType: Queries.getPost, options: Options): FetchState<PostType>;
};

export const useFetch: useFetchOverload = (queryType, options) => {
  const [state, dispatch] = useReducer(fetchReducer, initState);
  const { isLoading, isError, data } = state;

  const fetch = async () => {
    switch (queryType) {
      case Queries.getPosts:
        const posts = await queries.getPosts(options.userId);
        return posts;
      case Queries.getPost:
        const post = await queries.getPost(options.userId, options.postSlugs!);
        return post;
      default:
        throw new Error('Invalid query type');
    }
  };

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: FetchActions.FETCH_INIT });

      try {
        const res = await fetch();

        if (!didCancel) {
          dispatch({ type: FetchActions.FETCH_SUCCESS, payload: res });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: FetchActions.FETCH_FAILURE });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, []);

  return { isLoading, isError, data };
};
