import { Box, Heading, Spinner, useToast, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FormModeToggler } from './FormModeToggler';
import { useAuthContext } from '../../contexts/user/AuthContext';
import { useFormToast } from '../../hooks/useFormToast';
import { inputFields } from '../../constants';
import { InputFields } from './InputFields';
import { useHistory } from 'react-router-dom';
import { parseError } from '../../utils/errors';
import { FormProps } from '../../types/general';
import { FormData } from '../../types/user';
import { useForm } from 'react-hook-form';
import ButtonSubmit from '../generic/ButtonSubmit';
import RoutingLink from '../generic/RoutingLink';
import { useRegisterLogin } from '../../hooks/mutations';

type Props = Pick<FormProps, 'formMode' | 'setFormMode'>;

export default function RegisterLoginForm({ formMode, setFormMode }: Props) {
  const { logIn, setResponseError, setUserID, unauthedUrl, setUnauthedUrl } = useAuthContext();
  const history = useHistory();
  const toast = useToast();
  const [loggingIn, setLoggingIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const registerLoginMutation = useRegisterLogin();
  const formToast = useFormToast();
  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    if (unauthedUrl) {
      toast({
        status: 'info',
        title: 'Log in or register to view this post',
        duration: 5000,
        position: 'top',
      });
    }
  }, [unauthedUrl]);

  const onSubmit = async (data: FormData): Promise<void> => {
    setLoading(true);

    try {
      // todo - fix types
      const res = await registerLoginMutation.mutateAsync(data);

      res.status === 'success' ? setLoggingIn(true) : setLoading(false);
      formToast(formMode, res);

      // simulating delay
      setTimeout(() => {
        if (res.status === 'success') {
          setLoading(false);
          formMode === 'Register' ? setLoggingIn(false) : setLoggingIn(true);
          logIn(data.username);
          setUserID(res.userId);
          history.push({ pathname: unauthedUrl ?? '/' });
          setUnauthedUrl(null);
        } else {
          setLoading(false);
        }
      }, 2000);
    } catch (err) {
      setLoading(false);
      const { fieldErrors } = parseError(err);
      fieldErrors
        ? fieldErrors.forEach(({ field, message }) => setError(field, { message }))
        : setResponseError(err);
    }
  };

  const renderFormActions = () =>
    loading ? (
      <Spinner color='prim.800' mt='30px !important' />
    ) : (
      <>
        {<ButtonSubmit text={formMode} loading={loading} />}
        <FormModeToggler formMode={formMode} setFormMode={setFormMode} reset={reset} />
      </>
    );

  const renderWelcomeMessage = () => {
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

  const renderPasswordActions = () => {
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
            {renderFormActions()}
          </VStack>
        </form>
        {renderWelcomeMessage()}
        {renderPasswordActions()}
      </Box>
    </VStack>
  );
}
