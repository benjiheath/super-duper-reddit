type Dispatch<T> = (value: T) => void;

export interface UserDispatchers {
  setAuth: Dispatch<boolean>;
  setUser: Dispatch<string>;
  setUserID: Dispatch<number>;
  logIn: Dispatch<string>;
  logOut: () => void;
  setResponseError: (value: any) => void;
}

export interface UserState {
  authorized: boolean;
  username: string | null;
  userID: number | null;
  err: any;
}

export type UserCtx = UserDispatchers & UserState;
export type useUserCtx = () => UserCtx;

export interface FormData {
  username: string;
  password: string;
  email?: string;
}

export interface RecoveryEmailFormData {
  id: string;
}
