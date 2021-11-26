import { UseToastOptions } from '@chakra-ui/react';
import { FormMode } from '../types/general';
import { RegisterResponse, LoginResponse } from '../types/user';

export const generateFormToast = (
  formMode: FormMode,
  res: RegisterResponse | LoginResponse
): UseToastOptions => {
  if (formMode === 'Login' && res.status === 'success') {
    return {
      title: 'Logging you in ...',
      status: 'success',
      duration: 1500,
      isClosable: true,
    };
  }

  return {
    title: res.status === 'success' ? 'Registered!' : res.message,
    status: res.status === 'success' ? 'success' : 'error',
    duration: 3000,
    isClosable: true,
  };
};
