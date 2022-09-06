import { RegisterLoginMutationVariables, useRegisterLogin } from '../../hooks/mutations/useRegisterLogin';
import { Box, Heading, Spinner, VStack } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSuccessToast } from '../../hooks/useSrToast';
import { FormModeToggler } from './FormModeToggler';
import { useAuthContext } from '../../contexts/user/AuthContext';
import { useSrHistory } from '../../hooks/useSrHistory';
import { inputFields } from '../../constants';
import { InputFields } from './InputFields';
import { FormMode } from '../../pages/RegisterLoginPage';
import ButtonSubmit from '../generic/ButtonSubmit';
import RoutingLink from '../generic/RoutingLink';

interface Props {
  formMode: 'Register' | 'Login';
  setFormMode: Dispatch<SetStateAction<FormMode>>;
}

export default function RegisterLoginForm({ formMode, setFormMode }: Props) {
  const auth = useAuthContext();
  const history = useSrHistory();
  const methods = useForm();
  const registerLoginMutation = useRegisterLogin(methods.setError);
  const successToast = useSuccessToast();

  const { isSubmitting, errors } = methods.formState;

  const onSubmit = async (data: RegisterLoginMutationVariables): Promise<void> => {
    const res = await registerLoginMutation.mutateAsync(data);

    auth.logIn(res.userId, res.username);
    history.push(history.location.state?.unauthedUrl ?? '/');
    successToast(formMode === 'Register' ? 'Welcome to Super Reddit!' : 'Welcome back!');
  };

  const renderFormActions = () =>
    isSubmitting ? (
      <Spinner color='prim.800' mt='30px !important' />
    ) : (
      <Box pt='25px'>
        {<ButtonSubmit text={formMode} loading={isSubmitting} />}
        <FormModeToggler formMode={formMode} setFormMode={setFormMode} reset={methods.reset} />
      </Box>
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
      <FormProvider {...methods}>
        <Box as='form' onSubmit={methods.handleSubmit(onSubmit)} width={310}>
          <VStack>
            <InputFields
              inputFields={inputFields.registerLoginForm}
              formMode={formMode}
              register={methods.register}
              errors={errors}
            />
            {renderFormActions()}
          </VStack>
          {renderSubmittingMessage()}
          {renderPasswordActions()}
        </Box>
      </FormProvider>
    </VStack>
  );
}
