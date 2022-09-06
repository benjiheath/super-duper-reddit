import { useMutation } from '@tanstack/react-query';
import { FieldValues, UseFormSetError } from 'react-hook-form';
import { axiosPOST } from '../../utils/axiosMethods';
import { handleAsyncFormErrors } from './../../utils/errors';

const recoverAccountMutation = async (userIdentifier: string) =>
  await axiosPOST<string>('posts/favorites', { data: userIdentifier });

export const useRecoverAccountMutation = (setFormError: UseFormSetError<FieldValues>) => {
  const onError = (e: unknown) => handleAsyncFormErrors(e, setFormError);

  return useMutation((userIdentifier: string) => recoverAccountMutation(userIdentifier), { onError });
};
