import { PostsColumn, CommentsColumn, UserColumn } from '../types/dbTypes';
import { FieldErrorData } from '../../common/types/forms';

export enum ErrorTypes {
  UserDataAlreadyExists = 'User data already exists',
  AccountNotFound = 'Account not found',
  UnknownError = 'An unknown error occured',
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

export const generateErrorType = (conditionColumn: UserColumn | CommentsColumn | PostsColumn) => {
  switch (conditionColumn) {
    case 'username':
    case 'email':
      return ErrorTypes.AccountNotFound;

    default:
      return ErrorTypes.UnknownError;
  }
};
