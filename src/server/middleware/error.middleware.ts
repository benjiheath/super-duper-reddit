import { ErrorRequestHandler } from 'express';
import { SrError, SrErrorType } from '../../common/utils/errors';

export const errorHandler: ErrorRequestHandler = async (error, req, res, _) => {
  const getHttpErrorStatus = (type: SrErrorType) => {
    switch (type) {
      case SrErrorType.NotAllowed:
        return 403;
      case SrErrorType.AccountNotFound:
      case SrErrorType.AccountNotFound:
        return 404;
      case SrErrorType.UserIdentifierAlreadyExists:
        return 409;
      case SrErrorType.UnknownError:
      default:
        return 500;
    }
  };

  if (error instanceof SrError) {
    res.status(getHttpErrorStatus(error.type)).send(error);
    return;
  }

  console.error('Caught in middleware:', error);

  res.status(500).send();
};
