import { useToast } from '@chakra-ui/react';
import _ from 'lodash';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { useAuthContext } from '../../contexts/user/AuthContext';
import { editPostMutation } from '../../fetchers/mutations';
import { usePostQuery } from '../../hooks/queries';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CreatePostFields } from '../../types/posts';
import CreateOrEditPostForm from './CreateOrEditPostForm';

const EditPost = () => {
  // ............ TODO.........FIX if you edit a different post, 'saved changes' still load from the other post... kms
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
  const [isDirty, setIsDirty] = React.useState(false); // temp workaround for reset btn (currently can't rely on formState's isDirty)

  React.useEffect(() => {
    const currentPostData = { title: post?.title, contentUrl: post?.contentUrl, body: post?.body };

    const subscription = watch((value) => {
      const changesHaveBeenMade = !_.isEqual(value, currentPostData);
      if (changesHaveBeenMade) {
        localStoragePostEdit.setLsItem(value as CreatePostFields);
      }
      setIsDirty(changesHaveBeenMade);
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

    if (savedFormData) {
      toast({
        status: 'success',
        title: 'Loaded unsaved changes',
        position: 'top',
        duration: 3000,
        variant: 'pink',
      });
    }
  }, [post]);

  const onSubmit = async (data: CreatePostFields): Promise<void> => {
    const emptyFieldsNullified = _.mapValues(data, (value) => (value?.length === 0 ? null : value));
    const newPostData = { userId, username, ...emptyFieldsNullified };

    try {
      await editPostMutation({ ...newPostData, postSlugs });
      toast({
        position: 'top',
        title: 'Post updated successfully',
        duration: 1600,
        status: 'success',
        variant: 'srSuccessSubtle',
      });

      localStoragePostEdit.removeLsItem();
      history.goBack();
    } catch (err) {
      setResponseError(err);
    }
  };

  const handleReset = React.useCallback(() => {
    setIsDirty(false);
    localStoragePostEdit.removeLsItem();
    reset({ title: post?.title, contentUrl: post?.contentUrl, body: post?.body });
  }, []);

  return (
    <CreateOrEditPostForm
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      handleReset={handleReset}
      isResetDisabled={!isDirty}
      postSlugs={postSlugs}
    />
  );
};

export default EditPost;
