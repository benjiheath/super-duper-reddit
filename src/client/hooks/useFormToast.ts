import { UseToastOptions, useToast } from '@chakra-ui/react';
import { RegisterResponse, LoginResponse } from '../../common/types/fetching';
import { FormMode } from '../types/general';

export const useFormToast = () => {
  const toast = useToast();

  const formToast = (formMode: FormMode, res: RegisterResponse | LoginResponse) => {
    if (res.status === 'fail') {
      return undefined;
    }

    const toastOptions: UseToastOptions = {
      position: 'top',
      title: formMode === 'Login' ? 'Logging you in ...' : 'Registered!',
      status: 'success',
      duration: formMode === 'Login' ? 1500 : 3000,
      isClosable: true,
      variant: 'srSuccess',
    };

    return toast(toastOptions);
  };

  return formToast;
};

export const useSuccessToast = () => {
  const toast = useToast();

  return (title: string, options?: UseToastOptions) =>
    toast({
      title,
      position: 'top',
      duration: 1600,
      status: 'success',
      variant: 'srSuccess',
      ...options,
    });
};
