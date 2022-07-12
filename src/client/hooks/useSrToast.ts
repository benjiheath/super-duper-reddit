import { useToast, UseToastOptions } from '@chakra-ui/react';

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

export const useInfoToast = () => {
  const toast = useToast();

  return (title: string, options?: UseToastOptions) =>
    toast({
      title,
      position: 'top',
      duration: 4000,
      status: 'info',
      ...options,
    });
};
