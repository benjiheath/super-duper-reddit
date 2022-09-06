import { handleAsyncFormErrors } from './../../utils/errors';
import { FieldValues, UseFormSetError } from 'react-hook-form';
import { LoginResponse } from '../../../common/types';
import { useMutation } from '@tanstack/react-query';
import { axiosPOST } from '../../utils/axiosMethods';

export interface RegisterLoginMutationVariables {
  username: string;
  password: string;
  email?: string;
}

const registerMutation = async (payload: RegisterLoginMutationVariables) =>
  await axiosPOST<LoginResponse>('user', { data: payload });

const loginMutation = async (payload: RegisterLoginMutationVariables) =>
  await axiosPOST<LoginResponse>('session', { data: payload });

export const useRegisterLogin = (setFormError: UseFormSetError<FieldValues>) => {
  const onError = (e: unknown) => handleAsyncFormErrors(e, setFormError);

  return useMutation(
    (variables: RegisterLoginMutationVariables) =>
      variables.email ? registerMutation(variables) : loginMutation(variables),
    { onError }
  );
};
