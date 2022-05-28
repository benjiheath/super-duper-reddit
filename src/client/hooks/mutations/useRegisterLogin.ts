import { useMutation } from 'react-query';
import { LoginResponse } from '../../../common/types';
import { axiosPOST } from '../../utils/axiosMethods';

interface RegisterLoginMutationVariables {
  username: string;
  password: string;
  email?: string;
}

const registerMutation = async (payload: RegisterLoginMutationVariables) =>
  await axiosPOST<LoginResponse>('user', { data: payload });

const loginMutation = async (payload: RegisterLoginMutationVariables) =>
  await axiosPOST<LoginResponse>('session', { data: payload });

export const useRegisterLogin = () =>
  useMutation((variables: RegisterLoginMutationVariables) =>
    variables.email ? registerMutation(variables) : loginMutation(variables)
  );
