import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SrSpinner } from '../../components/generic';
import { ProviderProps } from '../../types/general';
import { UserCtx, useUserCtx } from '../../types/user';
import useGlobalUserReducer from './useGlobalUserReducer';

export const GlobalUserContext = createContext<UserCtx | null>(null);

const GlobalUserProvider = (props: ProviderProps) => {
  const [state, dispatchers] = useGlobalUserReducer();
  const { setAuth } = dispatchers;
  const { err } = state;
  const history = useHistory();

  const [loading, setLoading] = useState(true);

  const firstUpdate = useRef(true);
  useEffect(() => {
    setLoading(true);
    // prevent effects running on page load while err is null
    if (firstUpdate.current) {
      setLoading(false);
      firstUpdate.current = false;
      return;
    }

    // if err = not authed, redirect to login
    if (err) {
      switch (err.response.status) {
        case 401:
          setAuth(false);
          history.push({ pathname: '/login' });
          setLoading(false);
          return;

        case 404:
          history.push({ pathname: '/404' });
          setLoading(false);
          return;
      }
    }

    setLoading(false);
  }, [err]);

  if (loading) {
    return <SrSpinner />;
  }

  return (
    <GlobalUserContext.Provider value={{ ...state, ...dispatchers }}>
      {props.children}
    </GlobalUserContext.Provider>
  );
};

export const useGlobalUserContext: useUserCtx = () => useContext(GlobalUserContext) as UserCtx;

export default GlobalUserProvider;
