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
    <FormBox secondary p='50px 0' w={480}>
      <Heading as='h2' mb='40px' color='sec.900'>
        Reset your password
      </Heading>

      <Text fontSize='sm'>Enter your username or email to recieve a recovery link.</Text>

      <VStack mt={4} spacing='3px'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack w='240px'>
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

// v1

// <Text fontSize='md'>Enter your {inputType} to recieve a recovery link.</Text>

// <VStack mt={8} spacing='3px'>
//   <Box width={275} textAlign='left'>
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <FormControl id='username'>
//         {/* <FormLabel>Enter your {inputType}</FormLabel> */}
//         <Input
//           type='text'
//           placeholder={capitalize(inputType)}
//           {...register(inputType, {
//             required: `Please specify your ${inputType}`,
//             shouldUnregister: true,
//             minLength:
//               inputType === 'username'
//                 ? { value: 4, message: 'Username must have at least 4 characters' }
//                 : undefined,
//             pattern:
//               inputType === 'email'
//                 ? { value: regEmailPattern, message: 'Please enter a valid email' }
//                 : undefined,
//           })}
//         />
//         {errors[inputType] && <AlertPop title={errors[inputType].message} />}

//         <FormHelperText>
//           <Link
//             color='#caaec6'
//             onClick={() => {
//               reset();
//               setInputType(inputType === 'email' ? 'username' : 'email');
//             }}
//           >
//             Click here
//           </Link>
//           &nbsp; to use your {inputType === 'email' ? 'username' : 'email'} instead.
//         </FormHelperText>
//       </FormControl>

//       <ButtonSubmit text='Send email ' colorScheme='green' m='20px' />
//     </form>
