import { FieldValues, UseFormSetError } from 'react-hook-form';
import { LoginResponse } from '../../../common/types';
import { useMutation } from '@tanstack/react-query';
import { parseError } from './../../utils/errors';
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
  return useMutation(
    (variables: RegisterLoginMutationVariables) =>
      variables.email ? registerMutation(variables) : loginMutation(variables),
    {
      onError: (e: unknown) => {
        const { fieldErrors } = parseError(e);

        if (fieldErrors) {
          fieldErrors.forEach(({ field, message }) => setFormError(field, { message }));
        }
      },
    }
  );
};
