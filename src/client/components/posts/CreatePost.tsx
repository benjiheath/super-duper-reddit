import { useToast, VStack } from '@chakra-ui/react';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { PostResponse } from '../../../common/types/fetching';
import { inputFields } from '../../constants';
import { usePostsContext } from '../../contexts/posts/PostsContext';
import { useGlobalUserContext } from '../../contexts/user/GlobalUserContext';
import { CreatePostFields } from '../../types/posts';
import { axiosPOST } from '../../utils/axiosMethods';
import ButtonSubmit from '../generic/ButtonSubmit';
import FormBox from '../generic/FormBox';
import FormTextArea from '../generic/FormTextArea';
import { InputFields } from '../register/InputFields';

const CreatePost = () => {
  const { setResponseError, username, userId } = useGlobalUserContext();
  const { setPosts, posts } = usePostsContext();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const toast = useToast({
    containerStyle: {
      border: '20px solid red !important',
    },
  });

  const onSubmit = async (data: CreatePostFields): Promise<void> => {
    const emptyFieldsNullified = _.mapValues(data, (value) => (value?.length === 0 ? null : value));

    const newPostData = { creator_user_id: userId, creator_username: username, ...emptyFieldsNullified };

    try {
      const { post } = await axiosPOST<PostResponse>('posts', { data: newPostData });

      if (!post) {
        return;
        // TODO handle later - throw err?
      }

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

      history.push({ pathname: `${post.urlSlugs}` });
    } catch (err) {
      setResponseError(err);
    }
  };

  return (
    <FormBox title='New Post' headingSize='lg' w='800px'>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <VStack spacing='10px' m='0 auto'>
          <InputFields inputFields={inputFields.createPost} register={register} errors={errors} />
          <FormTextArea labelTitle='Body' register={register} errors={errors} />
          <ButtonSubmit text='Submit' isLoading={isSubmitting} />
        </VStack>
      </form>
    </FormBox>
  );
};

export default CreatePost;
