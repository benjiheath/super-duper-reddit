import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useInfoToast } from '../../hooks/useSrToast';
import { ProviderProps } from '../../types/general';
import { AuthContextType as AuthContextType, UseAuthContextType } from '../../types/user';
import useAuthReducer from './useAuthReducer';

export const AuthContext = React.createContext<AuthContextType | null>(null);

const AuthProvider = (props: ProviderProps) => {
  const infoToast = useInfoToast();
  const history = useHistory();
  const location = useLocation();
  const [state, dispatchers] = useAuthReducer();
  const [unauthedUrl, setUnauthedUrl] = React.useState<string | null>(null);

  const firstUpdate = React.useRef(true);
  React.useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (state.err) {
      switch (state.err.response?.status) {
        case 401:
          dispatchers.setAuth(false);
          history.push({ pathname: '/login' });
          location.pathname.includes('posts/') ? setUnauthedUrl(location.pathname) : setUnauthedUrl(null);
          return;

        case 404:
          history.push({ pathname: '/404' });
          return;

        // todo notify user hook?
      }
    }
  }, [state.err]);

  React.useEffect(() => {
    if (unauthedUrl) {
      infoToast('Log in or register to view this post');
    }
  }, [unauthedUrl]);

  return (
    <AuthContext.Provider value={{ ...state, ...dispatchers, unauthedUrl, setUnauthedUrl }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthContext: UseAuthContextType = () => React.useContext(AuthContext) as AuthContextType;

export default AuthProvider;
