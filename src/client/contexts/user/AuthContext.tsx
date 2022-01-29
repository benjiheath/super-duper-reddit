import { createContext, useContext, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { ProviderProps } from '../../types/general';
import { AuthContextType as AuthContextType, UseAuthContextType } from '../../types/user';
import useAuthReducer from './useAuthReducer';

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = (props: ProviderProps) => {
  const [state, dispatchers] = useAuthReducer();
  const { setAuth } = dispatchers;
  const { err } = state;
  const history = useHistory();

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (err) {
      switch (err.response.status) {
        case 401:
          setAuth(false);
          history.push({ pathname: '/login' });
          return;

        case 404:
          history.push({ pathname: '/404' });
          return;
      }
    }
  }, [err]);

  return <AuthContext.Provider value={{ ...state, ...dispatchers }}>{props.children}</AuthContext.Provider>;
};

export const useAuthContext: UseAuthContextType = () => useContext(AuthContext) as AuthContextType;

export default AuthProvider;
