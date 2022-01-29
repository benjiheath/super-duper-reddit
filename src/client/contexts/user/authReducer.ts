import { AuthState as AuthState } from '../../types/user';

export enum AuthActions {
  SET_AUTH = 'SET_AUTH',
  SET_USERNAME = 'SET_USERNAME',
  SET_USER_ID = 'SET_USER_ID',
  LOG_IN = 'LOG_IN',
  LOG_OUT = 'LOG_OUT',
  SET_CTX_ERR = 'SET_CTX_ERR',
}

type ACTIONTYPE =
  | { type: AuthActions.SET_AUTH; payload: boolean }
  | { type: AuthActions.SET_USERNAME; payload: string | null }
  | { type: AuthActions.SET_USER_ID; payload: string | null }
  | { type: AuthActions.LOG_IN; payload: string }
  | { type: AuthActions.LOG_OUT; payload?: undefined }
  | { type: AuthActions.SET_CTX_ERR; payload: any };

const lsUsername = localStorage.getItem('username');
const lsUserID = localStorage.getItem('userId');

export const initState: AuthState = {
  authorized: lsUsername !== null,
  username: lsUsername ?? null,
  userId: lsUserID ?? null,
  err: null,
};

export const authReducer = (state: AuthState, action: ACTIONTYPE): AuthState => {
  switch (action.type) {
    case AuthActions.SET_AUTH:
      return { ...state, authorized: action.payload };
    case AuthActions.SET_USERNAME:
      return { ...state, username: action.payload };
    case AuthActions.SET_USER_ID:
      return { ...state, userId: action.payload };
    case AuthActions.LOG_IN:
      return { ...state, username: action.payload, authorized: true };
    case AuthActions.LOG_OUT:
      return { username: null, userId: null, authorized: false, err: null };
    case AuthActions.SET_CTX_ERR:
      return { ...state, err: action.payload };
    default:
      throw new Error(`Unable to execute action: ${action}`);
  }
};
