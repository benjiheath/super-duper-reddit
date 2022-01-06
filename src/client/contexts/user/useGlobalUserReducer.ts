import { useReducer } from 'react';
import { UserState, UserDispatchers } from '../../types/user';
import { globalUserReducer, initState, UserContextActions } from './globalUserReducer';

const useGlobalUserReducer = (): [UserState, UserDispatchers] => {
  const [state, dispatch] = useReducer(globalUserReducer, initState);

  const dispatchers: UserDispatchers = {
    setAuth: (value: boolean) => {
      dispatch({ type: UserContextActions.SET_AUTH, payload: value });
    },
    setUser: (value: string) => {
      dispatch({ type: UserContextActions.SET_USERNAME, payload: value });
    },
    setUserID: (value: string) => {
      dispatch({ type: UserContextActions.SET_USER_ID, payload: value });
      localStorage.setItem('userId', value);
    },
    logIn: (value: string) => {
      dispatch({ type: UserContextActions.LOG_IN, payload: value });
      localStorage.setItem('username', value);
    },
    logOut: () => {
      dispatch({ type: UserContextActions.LOG_OUT });
      localStorage.removeItem('username');
    },
    setResponseError: (value: any) => {
      dispatch({ type: UserContextActions.SET_CTX_ERR, payload: value });
    },
  };

  return [state, dispatchers];
};

export default useGlobalUserReducer;
