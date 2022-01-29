import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SrSpinner } from '../../components/generic';
import { ProviderProps } from '../../types/general';
import { AuthContextType as AuthContextType, UseAuthContextType } from '../../types/user';
import useAuthReducer from './useAuthReducer';

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = (props: ProviderProps) => {
  const [state, dispatchers] = useAuthReducer();
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

  return <AuthContext.Provider value={{ ...state, ...dispatchers }}>{props.children}</AuthContext.Provider>;
};

export const useAuthContext: UseAuthContextType = () => useContext(AuthContext) as AuthContextType;

export default AuthProvider;
