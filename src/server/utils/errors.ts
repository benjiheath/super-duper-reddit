import { CommentsVoteColumn } from './../types/dbTypes';
import { CommentsColumn, PostsColumn, PostsVoteColumn, UserColumn } from '../types/dbTypes';
import { FieldErrorResponse } from './../types/misc';

export enum ErrorTypes {
  UserDataAlreadyExists = 'User data already exists',
  AccountNotFound = 'Account not found',
  UnknownError = 'An unknown error occured',
}

export class FieldError extends Error {
  info: FieldErrorResponse & { status: string };

  constructor(response: FieldErrorResponse) {
    super(response.message);

    this.info = { status: 'fail', ...response };
  }
}

export const generateErrorType = (
  conditionColumn: UserColumn | CommentsColumn | PostsColumn | PostsVoteColumn | CommentsVoteColumn
) => {
  switch (conditionColumn) {
    case 'username':
    case 'email':
      return ErrorTypes.AccountNotFound;

    default:
      return ErrorTypes.UnknownError;
  }
};
