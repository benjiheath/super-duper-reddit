import { useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../../contexts/user/AuthContext';
import { createPostMutation } from '../../fetching/mutations';
import { CreatePostFields } from '../../types/posts';
import CreateOrEditPostForm from './CreateOrEditPostForm';

const CreatePost = () => {
  const { setResponseError, username, userId } = useAuthContext();
  const history = useHistory();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: CreatePostFields): Promise<void> => {
    const newPostData = { creatorUserId: userId!, creatorUsername: username!, ...data };

    try {
      const post = await createPostMutation(newPostData);

      toast({
        position: 'top',
        title: 'Posted successfully',
        duration: 1600,
        status: 'success',
        variant: 'srSuccess',
      });

      history.push({ pathname: `${post.urlSlugs}` });
    } catch (err) {
      setResponseError(err);
    }
  };

  return (
    <CreateOrEditPostForm
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
    />
  );
};

export default CreatePost;
