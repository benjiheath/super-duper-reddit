import { FormControl, FormLabel, Heading, Input, useToast, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { useAuthContext } from '../../contexts/user/AuthContext';
import { axiosPATCH } from '../../utils/axiosMethods';
import ButtonSubmit from '../generic/ButtonSubmit';
import FormBox from '../generic/FormBox';
import AlertPop from '../register/AlertPop';

export default function PasswordResetForm() {
  const { logIn, setResponseError } = useAuthContext();
  const toast = useToast();
  const [loggingIn, setLoggingIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { id: token } = useParams<{ id: string }>();

  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  interface ResetPWFormData {
    newPassword: string;
    newPassword2: string;
  }

  const onSubmit = async (data: ResetPWFormData): Promise<void> => {
    if (data.newPassword2 !== data.newPassword) {
      setError('newPassword2', { message: 'Passwords must match' });
      return;
    }

    setLoading(true);

    try {
      const username = await axiosPATCH<string>('user/account', {
        data,
        params: token,
      });

      setLoggingIn(true);

      toast({
        title: 'Your password was reset successfully!',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
        variant: 'srSuccess',
      });

      setTimeout(() => {
        logIn(username);
        setLoading(false);
        setLoggingIn(false);
        history.push({ pathname: '/' });
      }, 2000);
    } catch (err) {
      setResponseError(err);
    }

    reset();
  };

  return (
    <FormBox secondary title='Choose a new password'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack width={275} spacing='3px' m='20px auto 0'>
          <FormControl>
            <FormLabel color='sec.800'>Password</FormLabel>
            <Input
              type='password'
              placeholder='Password'
              focusBorderColor='sec.800'
              {...register('newPassword', {
                required: 'Please specify your password',
                minLength: { value: 4, message: 'Password must have at least 4 characters' },
              })}
            />
          </FormControl>
          {errors.newPassword && <AlertPop title={errors.newPassword.message} />}
          <FormControl>
            <FormLabel color='sec.800'>Verify password</FormLabel>
            <Input
              type='password'
              focusBorderColor='sec.800'
              placeholder='Password'
              {...register('newPassword2', {
                required: 'Please verify your password',
                minLength: { value: 4, message: 'Password must have at least 4 characters' },
              })}
            />
          </FormControl>
          {errors.newPassword2 && <AlertPop title={errors.newPassword2.message} />}
          <ButtonSubmit
            variant='secondary'
            text='Submit '
            colorScheme='green'
            m='30px 0 0'
            loading={loading}
            loadingText='Verifying'
          />
        </VStack>
      </form>

      {loggingIn && (
        <>
          <Heading mt={5} as='h4' fontSize='20px' color='green'>
            Your password reset successfully
          </Heading>
          <Heading mt={2} as='h5' fontSize='16px'>
            Please wait while we log you in
          </Heading>
        </>
      )}
    </FormBox>
  );
}
