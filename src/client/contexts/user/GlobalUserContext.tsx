import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { ProviderProps } from '../../types/general';
import { UserCtx, useUserCtx } from '../../types/user';
import useGlobalUserReducer from './useGlobalUserReducer';

export const GlobalUserContext = createContext<UserCtx | null>(null);

const GlobalUserProvider = (props: ProviderProps) => {
  const [state, dispatchers] = useGlobalUserReducer();
  const { setAuth } = dispatchers;
  const { err } = state;
  const history = useHistory();

  const firstUpdate = useRef(true);
  useEffect(() => {
    // prevent effects running on page load while err is null
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    // if err = not authed, redirect to login
    if (err && err.response.status === 401) {
      setAuth(false);
      history.push({ pathname: '/login' });
      return;
    }
  }, [err]);

  return (
    <GlobalUserContext.Provider value={{ ...state, ...dispatchers }}>
      {props.children}
    </GlobalUserContext.Provider>
  );
};

export const useGlobalUserContext: useUserCtx = () => useContext(GlobalUserContext) as UserCtx;

export default GlobalUserProvider;
