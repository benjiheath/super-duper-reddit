import { UserState } from '../../types/user';

export enum UserContextActions {
  SET_AUTH = 'SET_AUTH',
  SET_USERNAME = 'SET_USERNAME',
  SET_USER_ID = 'SET_USER_ID',
  LOG_IN = 'LOG_IN',
  LOG_OUT = 'LOG_OUT',
  SET_CTX_ERR = 'SET_CTX_ERR',
}

type ACTIONTYPE =
  | { type: UserContextActions.SET_AUTH; payload: boolean }
  | { type: UserContextActions.SET_USERNAME; payload: string | null }
  | { type: UserContextActions.SET_USER_ID; payload: string | null }
  | { type: UserContextActions.LOG_IN; payload: string }
  | { type: UserContextActions.LOG_OUT; payload?: undefined }
  | { type: UserContextActions.SET_CTX_ERR; payload: any };

const lsUsername = localStorage.getItem('username');
const lsUserID = localStorage.getItem('userID');

export const initState: UserState = {
  authorized: lsUsername !== null,
  username: lsUsername ?? null,
  userID: lsUserID ?? null,
  err: null,
};

export const globalUserReducer = (state: UserState, action: ACTIONTYPE): UserState => {
  switch (action.type) {
    case UserContextActions.SET_AUTH:
      return { ...state, authorized: action.payload };
    case UserContextActions.SET_USERNAME:
      return { ...state, username: action.payload };
    case UserContextActions.SET_USER_ID:
      return { ...state, userID: action.payload };
    case UserContextActions.LOG_IN:
      return { ...state, username: action.payload, authorized: true };
    case UserContextActions.LOG_OUT:
      return { username: null, userID: null, authorized: false, err: null };
    case UserContextActions.SET_CTX_ERR:
      return { ...state, err: action.payload };
    default:
      throw new Error(`Unable to execute action: ${action}`);
  }
};
