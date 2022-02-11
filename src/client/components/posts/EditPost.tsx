import { useToast } from '@chakra-ui/react';
import _ from 'lodash';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { useAuthContext } from '../../contexts/user/AuthContext';
import { editPostMutation } from '../../fetching/mutations';
import { usePostQuery } from '../../hooks/queries';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CreatePostFields } from '../../types/posts';
import CreateOrEditPostForm from './CreateOrEditPostForm';

const EditPost = () => {
  const { setResponseError, username, userId } = useAuthContext();
  const { postSlugs } = useParams() as { postSlugs: string };
  const { data: post, isLoading, error } = usePostQuery({ postSlugs });
  const localStoragePostEdit = useLocalStorage<CreatePostFields>('editingPost');
  const history = useHistory();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  // TODO - toast on load if reloaded uncommited changes. add 'reset' btn if so? (and if isDirty)

  React.useEffect(() => {
    const subscription = watch((value) => {
      localStoragePostEdit.setLsItem(value as CreatePostFields);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  React.useEffect(() => {
    const savedFormData = localStoragePostEdit.getLsItem();

    const title = savedFormData?.title ?? post?.title;
    const contentUrl = savedFormData?.contentUrl ?? post?.contentUrl;
    const body = savedFormData?.body ?? post?.body;

    // pre-filling fields with unsaved changes if necessary
    reset({ title, contentUrl, body });
  }, [post]);

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

      localStoragePostEdit.removeLsItem();

      history.goBack();
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
      postSlugs={postSlugs}
    />
  );
};

export default EditPost;
