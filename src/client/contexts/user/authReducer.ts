import { useReducer } from 'react';
import { AuthDispatchers, AuthState } from './AuthContext';

export enum AuthActions {
  LOG_IN = 'LOG_IN',
  LOG_OUT = 'LOG_OUT',
}

export interface UserCreds {
  userId: string;
  username: string;
}

export type UserCredentialKey = keyof UserCreds;

type ACTIONTYPE = { type: AuthActions.LOG_IN; payload: UserCreds } | { type: AuthActions.LOG_OUT };

const getStoredUserCred = (key: UserCredentialKey) => localStorage.getItem(key);
const removeStoredUserCred = (key: UserCredentialKey) => localStorage.removeItem(key);
const setStoredUserCred = (key: UserCredentialKey, value: string) => localStorage.setItem(key, value);

const storedUserId = getStoredUserCred('userId');
const storedUsername = getStoredUserCred('username');

export const initState: AuthState = {
  userId: storedUserId ?? null,
  username: storedUsername ?? null,
  authorized: storedUserId !== null && storedUsername !== null,
};

const authReducer = (state: AuthState, action: ACTIONTYPE): AuthState => {
  switch (action.type) {
    case AuthActions.LOG_IN: {
      const { userId, username } = action.payload;
      return { ...state, username, userId, authorized: true };
    }
    case AuthActions.LOG_OUT:
      return { ...state, username: null, userId: null, authorized: false };
    default:
      throw new Error(`Unable to execute action: ${action}`);
  }
};

export const useAuthReducer = (): [AuthState, AuthDispatchers] => {
  const [state, dispatch] = useReducer(authReducer, initState);

  const dispatchers: AuthDispatchers = {
    logIn: (userId, username) => {
      setStoredUserCred('userId', userId);
      setStoredUserCred('username', username);
      dispatch({ type: AuthActions.LOG_IN, payload: { userId, username } });
    },
    logOut: () => {
      removeStoredUserCred('userId');
      removeStoredUserCred('username');
      dispatch({ type: AuthActions.LOG_OUT });
    },
  };

  return [state, dispatchers];
};
