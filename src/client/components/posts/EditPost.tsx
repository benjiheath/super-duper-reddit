import { useToast } from '@chakra-ui/react';
import _ from 'lodash';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useAuthContext } from '../../contexts/user/AuthContext';
import { editPostMutation } from '../../fetching/mutations';
import { usePostQuery } from '../../hooks/queries';
import { CreatePostFields } from '../../types/posts';
import CreateOrEditPostForm from './CreateOrEditPostForm';

const EditPost = () => {
  const { setResponseError, username, userId } = useAuthContext();
  const { postSlugs } = useParams() as { postSlugs: string };
  const location = useLocation();
  const history = useHistory();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const { data: post, isLoading, error } = usePostQuery({ postSlugs });

  const onSubmit = async (data: CreatePostFields): Promise<void> => {
    const emptyFieldsNullified = _.mapValues(data, (value) => (value?.length === 0 ? null : value));

    const newPostData = { creatorUserId: userId, creatorUsername: username, ...emptyFieldsNullified };

    try {
      await editPostMutation({ ...newPostData, postSlugs });

      toast({
        position: 'top',
        title: 'Post updated successfully',
        duration: 1600,
        status: 'success',
        variant: 'subtle',
      });

      history.goBack();
    } catch (err) {
      setResponseError(err);
    }
  };

  React.useEffect(() => {
    reset({ title: post?.title, contentUrl: post?.contentUrl, body: post?.body });
  }, [location.pathname]);

  return (
    <CreateOrEditPostForm
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      postSlugs={postSlugs}
    />
  );
};

export default EditPost;
