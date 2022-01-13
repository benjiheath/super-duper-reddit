import { useToast, VStack } from '@chakra-ui/react';
import _ from 'lodash';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { PostType } from '../../../common/types/entities';
import { inputFields } from '../../constants';
import { usePostsContext } from '../../contexts/posts/PostsContext';
import { useGlobalUserContext } from '../../contexts/user/GlobalUserContext';
import { CreatePostFields } from '../../types/posts';
import { axiosGET, axiosPATCH, axiosPOST } from '../../utils/axiosMethods';
import { SrSpinner } from '../generic';
import ButtonSubmit from '../generic/ButtonSubmit';
import FormBox from '../generic/FormBox';
import FormTextArea from '../generic/FormTextArea';
import { InputFields } from '../register/InputFields';

const CreateOrEditPost = () => {
  const { setResponseError, username, userId } = useGlobalUserContext();
  const { setPosts, posts } = usePostsContext();
  const [loading, setLoading] = React.useState(true);
  const params = useParams() as { postSlugs?: string };
  const location = useLocation();
  const history = useHistory();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: CreatePostFields): Promise<void> => {
    const emptyFieldsNullified = _.mapValues(data, (value) => (value?.length === 0 ? null : value));

    const newPostData = { creator_user_id: userId, creator_username: username, ...emptyFieldsNullified };

    try {
      const post = params.postSlugs
        ? await axiosPATCH<PostType>('posts/post', {
            data: { ...newPostData, postSlugs: params.postSlugs },
          })
        : await axiosPOST<PostType>('posts', { data: newPostData });

      console.log('recpost', post);

      if (!post) {
        return;
        // TODO handle later - throw err?
      }

      if (posts) {
        setPosts([post, ...posts]);
      }

      toast({
        position: 'top',
        title: params.postSlugs ? 'Post updated successfully' : 'Posted successfully',
        duration: 1600,
        status: 'success',
        variant: 'subtle',
      });

      params.postSlugs ? history.goBack() : history.push({ pathname: `${post.urlSlugs}` });
    } catch (err) {
      setResponseError(err);
    }
  };

  React.useEffect(() => {
    if (params?.postSlugs) {
      const fetchPost = async () => {
        const post = await axiosGET<PostType>('posts/post', {
          queries: { userId, postSlugs: params.postSlugs },
        });
        reset({ title: post?.title, contentUrl: post?.contentUrl, body: post.body });
      };
      fetchPost();
      setLoading(false);
      return;
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  if (loading) {
    return <SrSpinner />;
  }

  return (
    <FormBox title={params.postSlugs ? 'Edit post' : 'New Post'} headingSize='lg' w='800px'>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <VStack spacing='10px' m='0 auto'>
          <InputFields inputFields={inputFields.createPost} register={register} errors={errors} />
          <FormTextArea labelTitle='Body' register={register} errors={errors} />
          <ButtonSubmit text={params.postSlugs ? 'Save' : 'Submit'} isLoading={isSubmitting} />
        </VStack>
      </form>
    </FormBox>
  );
};

export default CreateOrEditPost;
