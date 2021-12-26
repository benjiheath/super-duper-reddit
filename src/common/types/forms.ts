type Auth = { auth: boolean };

export type FieldErrorData = { field: string; message: string };

export type RegisterResponse = StatusAndMessage & { errors?: FieldErrorData[] };

export type LoginResponse = StatusAndMessage & Auth & { errors?: FieldErrorData[] };

export type RecoveryResponse = StatusAndMessage & { sentTo: string } & { error?: FieldErrorData };

export type PwResetResponse = StatusAndMessage & { username: string };

export type SessionInfo = Auth & { userID: string | null };

export interface StatusAndMessage {
  status: 'fail' | 'success';
  message?: string;
}

export interface ServerResponse extends StatusAndMessage {
  errors?: FieldErrorData[];
  error?: FieldErrorData;
  auth?: boolean;
  sentTo?: string;
  username?: string;
  userID?: string | null;
  id?: number | null;
}
