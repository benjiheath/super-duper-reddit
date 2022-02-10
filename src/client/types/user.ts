import { Dispatch } from './general';

export interface AuthDispatchers {
  setAuth: Dispatch<boolean>;
  setUser: Dispatch<string>;
  setUserID: Dispatch<string>;
  logIn: Dispatch<string>;
  logOut: () => void;
  setResponseError: (value: any) => void;
}

export interface AuthState {
  authorized: boolean;
  username: string | null;
  userId: string | null;
  err: any;
}

export interface UnauthedUrlState {
  unauthedUrl: string | null;
  setUnauthedUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export type AuthContextType = AuthDispatchers & AuthState & UnauthedUrlState;
export type UseAuthContextType = () => AuthContextType;

export interface FormData {
  username: string;
  password: string;
  email?: string;
}

export interface RecoveryEmailFormData {
  id: string;
}
