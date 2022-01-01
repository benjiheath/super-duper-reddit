import { FormControl, FormLabel, Input, useToast, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { createPostSlugs } from '../../../common/utils';
import { usePostsContext } from '../../contexts/posts/PostsContext';
import { useGlobalUserContext } from '../../contexts/user/GlobalUserContext';
import { CreatePostFields } from '../../types/posts';
import { axiosRequest } from '../../utils/axiosMethods';
import ButtonSubmit from '../generic/ButtonSubmit';
import FormBox from '../generic/FormBox';
import FormTextArea from '../generic/FormTextArea';
import AlertPop from '../register/AlertPop';

const CreatePost = () => {
  const { setResponseError, username, userID } = useGlobalUserContext();
  const { setPosts, posts } = usePostsContext();
  const history = useHistory();
  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();
  const toast = useToast({
    containerStyle: {
      border: '20px solid red !important',
    },
  });

  const onSubmit = async (data: CreatePostFields): Promise<void> => {
    const newPostData = { creator_user_id: userID, creator_username: username, ...data };

    try {
      const { post } = await axiosRequest('post', 'posts', newPostData);

      if (!post) {
        return;
        // TODO handle later - throw err?
      }

      const postSlugs = createPostSlugs(post.id, post.title);

      if (posts) {
        setPosts([post, ...posts]);
      }

      toast({
        position: 'top',
        title: 'Posted successfully',
        duration: 1200,
        status: 'success',
        variant: 'subtle',
      });

      history.push({ pathname: `${postSlugs}` });
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
            <FormTextArea register={register} />
          </FormControl>
          {errors.body && <AlertPop title={errors.body.message} />}
          <ButtonSubmit text='Submit' isLoading={isSubmitting} />
        </VStack>
      </form>
    </FormBox>
  );
};

export default CreatePost;
