import { FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { LoginResponse } from '../../../common/types';
import { useAuthContext } from '../../contexts/user/AuthContext';
import { useSuccessToast } from '../../hooks/useSrToast';
import { axiosPATCH } from '../../utils/axiosMethods';
import ButtonSubmit from '../generic/ButtonSubmit';
import FormBox from '../generic/FormBox';
import AlertPop from '../resisterAndLogin/AlertPop';

export const PasswordResetForm = () => {
  const auth = useAuthContext();
  const successToast = useSuccessToast();
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

    const res = await axiosPATCH<LoginResponse>('user/account', { data: { ...data, token } });

    auth.logIn(res.userId, res.username);
    history.push('/');
    successToast('Your password was reset successfully!');

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
              mb={4}
            />
          </FormControl>
          {errors.newPassword2 && <AlertPop title={errors.newPassword2.message} />}
          <ButtonSubmit
            variant='secondary'
            text='Submit '
            colorScheme='green'
            loading={false}
            loadingText='Verifying'
          />
        </VStack>
      </form>
    </FormBox>
  );
};
