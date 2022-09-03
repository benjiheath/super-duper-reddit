import React from 'react';
import { AxiosError } from 'axios';
import { useSrHistory } from './useSrHistory';
import { useInfoToast } from './useSrToast';

export const useHandleHttpError = () => {
  const history = useSrHistory();
  const infoToast = useInfoToast();
  const { pathname } = history.location;

  const handle401 = React.useCallback(() => {
    if (pathname.includes('posts/')) {
      infoToast('Log in or Register to view this post');
      history.push('/login', { unauthedUrl: pathname });
      return;
    }

    history.push('/login');
  }, [pathname]);

  const handleHttpError = (e: unknown) => {
    if ((e as any)?.isAxiosError) {
      const axiosError = e as AxiosError;

      switch (axiosError.response?.status) {
        case 401: {
          handle401();
          return;
        }

        case 404:
          history.push('/404');
          return;

        default:
          throw axiosError;
      }
    }
  };

  return handleHttpError;
};
