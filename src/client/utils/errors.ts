import { FieldError } from '../../common/types';
import { SrError, SrErrorType } from './../../common/utils/errors';

export const parseError = (error: any) => {
  const responseError = error?.response?.data;

  const fieldErrors = responseError?.fieldErrors;
  if (fieldErrors) {
    return { fieldErrors: fieldErrors as FieldError[] };
  }

  const type = responseError?.type;
  const message = responseError?.message;
  if (type) {
    return new SrError({ type, message });
  }

  return new SrError({ type: SrErrorType.UnknownError });
};
