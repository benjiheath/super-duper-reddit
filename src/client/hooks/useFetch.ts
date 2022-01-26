import { useEffect, useReducer } from 'react';

interface FetchState<A> {
  isLoading: boolean;
  isError: boolean;
  data: A | null;
}

enum FetchActions {
  FETCH_INIT = 'FETCH_INIT',
  FETCH_SUCCESS = 'FETCH_SUCCESS',
  FETCH_FAILURE = 'FETCH_FAILURE',
}

type ACTIONTYPE<A> =
  | { type: FetchActions.FETCH_INIT }
  | { type: FetchActions.FETCH_SUCCESS; payload: A }
  | { type: FetchActions.FETCH_FAILURE };

const fetchReducer = <A>(state: FetchState<A>, action: ACTIONTYPE<A>): FetchState<A> => {
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

interface Options<A> {
  query: () => Promise<A>;
}

export const useFetch = <A>(options: Options<A>) => {
  const initState: FetchState<A> = {
    isLoading: false,
    isError: false,
    data: null,
  };

  const [state, dispatch] = useReducer(fetchReducer, initState);
  const { isLoading, isError, data } = state as FetchState<A>;

  useEffect(() => {
    const fetchData = async () => {
      if (!state.isLoading) {
        dispatch({ type: FetchActions.FETCH_INIT });

        try {
          const res = await options.query();

          dispatch({ type: FetchActions.FETCH_SUCCESS, payload: res });
        } catch (error) {
          dispatch({ type: FetchActions.FETCH_FAILURE });
        }
      }
    };

    fetchData();
  }, []);

  return { isLoading, isError, data };
};
