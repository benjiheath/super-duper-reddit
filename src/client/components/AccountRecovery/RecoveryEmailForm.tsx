import { useRecoverAccountMutation } from '../../hooks/mutations/useRecoverAccountMutation';
import { useSuccessToast } from '../../hooks/useSrToast';
import { Input, VStack } from '@chakra-ui/react';
import { obscureEmail } from '../../utils/misc';
import { FaArrowLeft } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import ButtonSubmit from '../generic/ButtonSubmit';
import RoutingLink from '../generic/RoutingLink';
import AlertPop from '../resisterAndLogin/AlertPop';
import FormBox from '../generic/FormBox';

export default function RecoveryEmailForm() {
  const successToast = useSuccessToast();
  const methods = useForm();
  const recoverAccountMutation = useRecoverAccountMutation(methods.setError);

  const { errors } = methods.formState;

  const onSubmit = async (data: { id: string }): Promise<void> => {
    const res = await recoverAccountMutation.mutateAsync(data.id);

    successToast(`Email sent to ${obscureEmail(res)}`, { duration: 6000 });
    methods.reset();
  };

  return (
    <FormBox
      secondary
      title='Reset your password'
      subTitle='Enter your username or email to recieve a recovery link.'
    >
      <VStack mt={10} spacing='3px'>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <VStack w='260px'>
            <Input
              focusBorderColor='sec.800'
              type='text'
              placeholder='Username or email'
              {...methods.register('id', {
                required: 'Please specify your username or email address',
                minLength: { value: 4, message: 'Usernames must have at least 4 characters' },
              })}
              mb={4}
            />
            {errors.id && <AlertPop title={errors.id.message} />}
            <ButtonSubmit
              text='Send email'
              colorScheme='green'
              loading={recoverAccountMutation.isLoading}
              loadingText='Sending'
              variant='secondary'
            />
            {!recoverAccountMutation.isLoading && (
              <RoutingLink to='/login' text='Back to login' icon={FaArrowLeft} subtle />
            )}
          </VStack>
        </form>
      </VStack>
    </FormBox>
  );
}
