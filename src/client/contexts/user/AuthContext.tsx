import React from 'react';
import { ProviderProps } from '../../types/general';
import { useAuthReducer } from './authReducer';

export interface AuthState {
  authorized: boolean;
  username: string | null;
  userId: string | null;
}

export interface AuthDispatchers {
  logIn: (userId: string, username: string) => void;
  logOut: () => void;
}

export type AuthContextType = AuthDispatchers & AuthState;
export type UseAuthContextType = () => AuthContextType;

export const AuthContext = React.createContext<AuthContextType | null>(null);

const AuthProvider = (props: ProviderProps) => {
  const [state, dispatchers] = useAuthReducer();

  return <AuthContext.Provider value={{ ...state, ...dispatchers }}>{props.children}</AuthContext.Provider>;
};

export const useAuthContext: UseAuthContextType = () => React.useContext(AuthContext) as AuthContextType;

export default AuthProvider;
