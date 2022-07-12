import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ProviderProps } from '../../types/general';
import { AuthContextType as AuthContextType, UseAuthContextType } from '../../types/user';
import useAuthReducer from './useAuthReducer';

export const AuthContext = React.createContext<AuthContextType | null>(null);

const AuthProvider = (props: ProviderProps) => {
  const [state, dispatchers] = useAuthReducer();
  const { setAuth } = dispatchers;
  const { err } = state;
  const history = useHistory();
  const location = useLocation();
  const [unauthedUrl, setUnauthedUrl] = React.useState<string | null>(null);

  const firstUpdate = React.useRef(true);
  React.useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (err) {
      switch (err.response?.status) {
        case 401:
          setAuth(false);
          history.push({ pathname: '/login' });
          location.pathname.includes('posts/') ? setUnauthedUrl(location.pathname) : setUnauthedUrl(null);
          return;

        case 404:
          history.push({ pathname: '/404' });
          return;
      }
    }
  }, [err]);

  return (
    <AuthContext.Provider value={{ ...state, ...dispatchers, unauthedUrl, setUnauthedUrl }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthContext: UseAuthContextType = () => React.useContext(AuthContext) as AuthContextType;

export default AuthProvider;
