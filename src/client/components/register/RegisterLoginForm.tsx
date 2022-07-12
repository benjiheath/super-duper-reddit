import { Box, Heading, Spinner, useToast, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FormModeToggler } from './FormModeToggler';
import { useAuthContext } from '../../contexts/user/AuthContext';
import { inputFields } from '../../constants';
import { InputFields } from './InputFields';
import { useHistory } from 'react-router-dom';
import { parseError } from '../../utils/errors';
import { FormMode, FormProps } from '../../types/general';
import { FormData } from '../../types/user';
import { useForm } from 'react-hook-form';
import ButtonSubmit from '../generic/ButtonSubmit';
import RoutingLink from '../generic/RoutingLink';
import { useRegisterLogin } from '../../hooks/mutations/useRegisterLogin';
import { useSuccessToast } from '../../hooks/useSrToast';

type Props = Pick<FormProps, 'formMode' | 'setFormMode'>;

export default function RegisterLoginForm({ formMode, setFormMode }: Props) {
  const auth = useAuthContext();
  const history = useHistory();
  const registerLoginMutation = useRegisterLogin();
  const successToast = useSuccessToast();
  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      // todo - fix types
      const res = await registerLoginMutation.mutateAsync(data);

      successToast(formMode === 'Register' ? 'Welcome to Super Reddit!' : 'Welcome back!');

      auth.logIn(data.username);
      auth.setUserID(res.userId);
      history.push({ pathname: auth.unauthedUrl ?? '/' });
      auth.setUnauthedUrl(null);
    } catch (err) {
      const { fieldErrors } = parseError(err);
      fieldErrors
        ? fieldErrors.forEach(({ field, message }) => setError(field, { message }))
        : auth.setResponseError(err);
    }
  };

  const renderFormActions = () =>
    isSubmitting ? (
      <Spinner color='prim.800' mt='30px !important' />
    ) : (
      <>
        {<ButtonSubmit text={formMode} loading={isSubmitting} />}
        <FormModeToggler formMode={formMode} setFormMode={setFormMode} reset={reset} />
      </>
    );

  const renderSubmittingMessage = () => {
    if (isSubmitting) {
      return (
        <>
          <Heading my={5} as='h4' fontSize='20px' color='prim.700'>
            {formMode === 'Register' ? 'Registering your account ...' : 'Logging you in ...'}
          </Heading>
          <Heading my={2} as='h5' fontSize='16px'>
            Please wait
          </Heading>
        </>
      );
    }
  };

  const renderPasswordActions = () => {
    if (formMode === 'Login' && !isSubmitting) {
      return <RoutingLink text='Forgot your password?' to='/reset-password' subtle />;
    }
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
        {renderSubmittingMessage()}
        {renderPasswordActions()}
      </Box>
    </VStack>
  );
}
