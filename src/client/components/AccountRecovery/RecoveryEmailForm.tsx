import { Heading, Input, Text, useToast, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGlobalUserContext } from '../../contexts/user/GlobalUserContext';
import { RecoveryEmailFormData } from '../../types/user';
import { axiosRequest } from '../../utils/axiosMethods';
import { obscureEmail } from '../../utils/misc';
import ButtonSubmit from '../generic/ButtonSubmit';
import FormBox from '../generic/FormBox';
import AlertPop from '../register/AlertPop';

export default function RecoveryEmailForm() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { setResponseError } = useGlobalUserContext();

  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ id }: RecoveryEmailFormData): Promise<void> => {
    setLoading(true);
    const idType = id.includes('@') ? 'email' : 'username';

    try {
      const res = await axiosRequest('post', 'user/account', { [idType]: id });

      // TODO need guard clause for atypical/unexpected errors. if so, setResponseError to something generic that CTX can handle, then return

      if (res?.errors) {
        const [{ message }] = res.errors;
        setError('id', { message });
        setLoading(false);
        return;
      }
      toast({
        title: `Email sent to ${obscureEmail(res.sentTo!)}`,
        status: 'success',
        duration: 6000,
        isClosable: true,
        position: 'top',
      });
    } catch (err) {
      setResponseError(err);
    }
    reset();
    setLoading(false);
  };

  return (
    <FormBox
      secondary
      title='Reset your password'
      subTitle='Enter your username or email to recieve a recovery link.'
    >
      <VStack mt={10} spacing='3px'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack w='260px'>
            <Input
              focusBorderColor='sec.800'
              type='text'
              placeholder='Username or email'
              {...register('id', {
                required: 'Please specify your username or email address',
                minLength: { value: 4, message: 'Usernames must have at least 4 characters' },
              })}
            />
            {errors.id && <AlertPop title={errors.id.message} />}
            <ButtonSubmit
              text='Send email'
              colorScheme='green'
              m='35px 0 0'
              loading={loading}
              loadingText='Sending'
              variant='secondary'
            />
          </VStack>
        </form>
      </VStack>
    </FormBox>
  );
}
