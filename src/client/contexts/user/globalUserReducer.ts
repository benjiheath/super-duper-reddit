import { UserState } from '../../types/user';

type ACTIONTYPE =
  | { type: 'SET_AUTH'; payload: boolean }
  | { type: 'SET_USERNAME'; payload: string | null }
  | { type: 'LOG_IN'; payload: string }
  | { type: 'LOG_OUT'; payload?: undefined }
  | { type: 'SET_CTX_ERR'; payload: any };

const lsUsername = localStorage.getItem('username');

export const initState: UserState = {
  authorized: lsUsername ? true : false,
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
