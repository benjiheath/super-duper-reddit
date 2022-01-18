import { Box, Heading, Spinner, useToast, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { ServerResponse } from '../../../common/types/fetching';
import { inputFields } from '../../constants';
import { useGlobalUserContext } from '../../contexts/user/GlobalUserContext';
import { FormProps } from '../../types/general';
import { FormData } from '../../types/user';
import { axiosPOST, axiosRequest } from '../../utils/axiosMethods';
import { generateFormToast } from '../../utils/generateToast';
import ButtonSubmit from '../generic/ButtonSubmit';
import RoutingLink from '../generic/RoutingLink';
import { FormModeToggler } from './FormModeToggler';
import { InputFields } from './InputFields';

type Props = Pick<FormProps, 'formMode' | 'setFormMode'>;

export default function RegisterLoginForm({ formMode, setFormMode }: Props) {
  const { logIn, setResponseError, setUserID } = useGlobalUserContext();
  const history = useHistory();
  const toast = useToast();
  const [loggingIn, setLoggingIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: FormData): Promise<void> => {
    setLoading(true);

    try {
      const endpoint = formMode === 'Register' ? 'user' : 'session';

      const res = await axiosPOST<ServerResponse>(endpoint, { data });

      console.log('register/login res:', res);

      res.status === 'success' ? setLoggingIn(true) : setLoading(false);
      toast(generateFormToast(formMode, res));

      // simulating delay
      setTimeout(() => {
        if (res.status === 'success') {
          setLoading(false);
          formMode === 'Register' ? setLoggingIn(false) : setLoggingIn(true);
          logIn(data.username);
          setUserID(res.userId!);
          history.push({ pathname: '/' });
        } else {
          setLoading(false);
        }
      }, 2000);

      // set field errors from err objects in response
      res.errors?.forEach(({ field, message }) => setError(field, { message }));
    } catch (err) {
      setResponseError(err);
    }
  };

  const FormActions = () =>
    loading ? (
      <Spinner color='prim.800' mt='30px !important' />
    ) : (
      <>
        {<ButtonSubmit text={formMode} loading={loading} />}
        <FormModeToggler formMode={formMode} setFormMode={setFormMode} reset={reset} />
      </>
    );

  const WelcomeMessage = () => {
    if (loggingIn) {
      return (
        <>
          <Heading my={5} as='h4' fontSize='20px' color='prim.700'>
            {formMode === 'Register' ? 'Welcome to Super Reddit!' : 'Welcome back!'}
          </Heading>
          <Heading my={2} as='h5' fontSize='16px'>
            Please wait while we log you in
          </Heading>
        </>
      );
    }
    return null;
  };

  const PasswordActions = () => {
    if (formMode === 'Login' && !loggingIn) {
      return <RoutingLink text='Forgot your password?' to='/reset-password' subtle />;
    }
    return null;
  };

  return (
    <VStack mt={8} spacing='3px'>
      <Box width={310}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack>
            <InputFields
              inputFields={inputFields.registerLoginForm}
              formMode={formMode}
              register={register}
              errors={errors}
            />
            <FormActions />
          </VStack>
        </form>
        <WelcomeMessage />
        <PasswordActions />
      </Box>
    </VStack>
  );
}
