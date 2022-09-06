import { DbColumnType } from '../../server/database/database.types';
import { FieldError } from '../types';

export enum SrErrorType {
  UsernameAlreadyExists = 'Sorry, that username is already taken',
  EmailAlreadyExists = 'Sorry, that email address is already taken',
  UrlSlugsAlreadyExist = 'Url slugs already exist',
  UserIdentifierAlreadyExists = 'UserIdentifierAlreadyExists',
  UnAuthorized = 'UnAuthorized',
  AccountNotFound = 'Account not found',
  ResourceDoesNotExist = `This resource doesn't exist`,
  UnknownError = 'An unknown error occured',
  DuplicationError = 'DuplicationError',
  InvalidToken = 'InvalidToken',
  InvalidPassword = 'InvalidPassword',
  InvalidArgumentException = 'InvalidArgumentException',
  NotAllowed = 'NotAllowed',
}

export type FieldErrorResponse = { errors: FieldError[] };
export type FieldErrorColumn = 'username' | 'email' | 'password';

export type SrErrorArgs = {
  type: SrErrorType;
  message?: string;
  fields?: FieldErrorColumn[];
};

export class SrError extends Error {
  type: SrErrorType;
  message: string;
  fieldErrors?: FieldError[];

  constructor(response: SrErrorArgs) {
    const { type, message, fields } = response;
    super(message ?? type);

    this.type = type;
    this.message = message ?? type;
    this.fieldErrors = fields?.map((field) => ({ field, message: this.generateFieldErrorMessage(field) }));
  }

  private generateFieldErrorMessage(field: FieldErrorColumn) {
    switch (this.type) {
      case SrErrorType.UserIdentifierAlreadyExists:
        return `Sorry, that ${field} is already taken`;
      case SrErrorType.AccountNotFound:
        return 'Account not found';
      case SrErrorType.InvalidPassword:
        return 'Invalid Password';
      default:
        throw new SrError({ type: SrErrorType.InvalidArgumentException });
    }
  }
}

export const generateErrorType = (conditionColumn: DbColumnType) => {
  switch (conditionColumn) {
    case 'username':
    case 'email':
      return SrErrorType.AccountNotFound;

    default:
      return SrErrorType.UnknownError;
  }
};
