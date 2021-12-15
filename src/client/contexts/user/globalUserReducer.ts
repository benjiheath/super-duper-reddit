import { UserState } from '../../types/user';

export enum UserContextActions {
  SET_AUTH = 'SET_AUTH',
  SET_USERNAME = 'SET_USERNAME',
  LOG_IN = 'LOG_IN',
  LOG_OUT = 'LOG_OUT',
  SET_CTX_ERR = 'SET_CTX_ERR',
}

type ACTIONTYPE =
  | { type: UserContextActions.SET_AUTH; payload: boolean }
  | { type: UserContextActions.SET_USERNAME; payload: string | null }
  | { type: UserContextActions.LOG_IN; payload: string }
  | { type: UserContextActions.LOG_OUT; payload?: undefined }
  | { type: UserContextActions.SET_CTX_ERR; payload: any };

const lsUsername = localStorage.getItem('username');

export const initState: UserState = {
  authorized: lsUsername !== null,
  username: lsUsername ?? null,
  err: null,
};

export const globalUserReducer = (state: UserState, action: ACTIONTYPE): UserState => {
  switch (action.type) {
    case 'SET_AUTH':
      return { ...state, authorized: action.payload };
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    case 'LOG_IN':
      return { ...state, username: action.payload, authorized: true };
    case 'LOG_OUT':
      return { username: null, authorized: false, err: null };
    case 'SET_CTX_ERR':
      return { ...state, err: action.payload };
    default:
      throw new Error(`Unable to execute action: ${action}`);
  }
};
