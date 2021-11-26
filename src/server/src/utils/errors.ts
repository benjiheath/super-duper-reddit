import { FieldErrorData } from './../../../common/types/forms';

export enum ErrorTypes {
  UserDataAlreadyExists = 'User data already exists',
  AccountNotFound = 'Account not found',
}

interface FieldErrorInfo {
  message: string;
  errors: FieldErrorData[];
}

export class FieldError extends Error {
  info: FieldErrorInfo & { status: string };

  constructor(response: FieldErrorInfo) {
    super(response.message);

    this.info = { status: 'fail', ...response };
  }
}
