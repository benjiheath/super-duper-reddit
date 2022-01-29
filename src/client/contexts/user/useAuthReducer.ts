import { useReducer } from 'react';
import { AuthState, AuthDispatchers } from '../../types/user';
import { authReducer, initState, AuthActions } from './authReducer';

const useAuthReducer = (): [AuthState, AuthDispatchers] => {
  const [state, dispatch] = useReducer(authReducer, initState);

  const dispatchers: AuthDispatchers = {
    setAuth: (value: boolean) => {
      dispatch({ type: AuthActions.SET_AUTH, payload: value });
    },
    setUser: (value: string) => {
      dispatch({ type: AuthActions.SET_USERNAME, payload: value });
    },
    setUserID: (value: string) => {
      dispatch({ type: AuthActions.SET_USER_ID, payload: value });
      localStorage.setItem('userId', value);
    },
    logIn: (value: string) => {
      dispatch({ type: AuthActions.LOG_IN, payload: value });
      localStorage.setItem('username', value);
    },
    logOut: () => {
      dispatch({ type: AuthActions.LOG_OUT });
      localStorage.removeItem('username');
    },
    setResponseError: (value: any) => {
      dispatch({ type: AuthActions.SET_CTX_ERR, payload: value });
    },
  };

  return [state, dispatchers];
};

export default useAuthReducer;
