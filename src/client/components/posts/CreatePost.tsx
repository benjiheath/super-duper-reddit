import { FormControl, FormLabel, Input, Textarea, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useGlobalUserContext } from '../../contexts/user/GlobalUserContext';
import { axiosRequest } from '../../utils/axiosMethods';
import ButtonSubmit from '../generic/ButtonSubmit';
import FormBox from '../generic/FormBox';
import AlertPop from '../register/AlertPop';

const CreatePost = () => {
  const { setResponseError, username, userID } = useGlobalUserContext();
  const history = useHistory();
  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  interface Post {
    title: string;
    body: string;
  }

  const onSubmit = async (data: Post): Promise<void> => {
    const newPostData = { creator_user_id: userID, ...data };

    setLoading(true);

    try {
      await axiosRequest('post', 'posts', newPostData);

      setLoading(false);
    } catch (err) {
      setResponseError(err);
    }
  };

  // const Spin = () => (loading ? <Spinner color='prim.800' /> : null);

  return (
    <FormBox title='New Post' size='lg'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack width='80vw' maxW='800px' spacing='10px' m='0 auto'>
          <FormControl>
            <FormLabel color='prim.800'>Title</FormLabel>
            <Input
              type='text'
              placeholder='title'
              borderColor='prim.100'
              focusBorderColor='sec.300'
              _hover={{ borderColor: 'sec.400' }}
              {...register('title', {
                required: 'Title required',
              })}
              _focus={{ boxShadow: '1px 1px 10px 3px #bcffe1b2', borderColor: 'sec.400' }}
            />
          </FormControl>
          {errors.title && <AlertPop title={errors.title.message} />}

          <FormControl mt='30px !important'>
            <FormLabel color='prim.800'>Body</FormLabel>
            <Textarea
              minH={150}
              borderColor='prim.100'
              _hover={{ borderColor: 'sec.400' }}
              placeholder='Enter your text here...'
              focusBorderColor='sec.300'
              {...register('body', {
                required: 'Body required',
              })}
              _focus={{ boxShadow: '1px 1px 10px 3px #bcffe1b2', borderColor: 'sec.400' }}
            />
          </FormControl>
          {errors.body && <AlertPop title={errors.body.message} />}
          <ButtonSubmit text='Submit' />
        </VStack>
      </form>
    </FormBox>
  );
};

export default CreatePost;