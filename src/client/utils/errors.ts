import { UseFormSetError, FieldValues } from 'react-hook-form';
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

export const handleAsyncFormErrors = (e: unknown, setFormError: UseFormSetError<FieldValues>) => {
  const { fieldErrors } = parseError(e);

  if (fieldErrors) {
    fieldErrors.forEach(({ field, message }) => setFormError(field, { message }));
  }
};
