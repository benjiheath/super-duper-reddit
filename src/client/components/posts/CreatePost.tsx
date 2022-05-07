import { useToast } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../../contexts/user/AuthContext';
import { createPostMutation } from '../../fetchers/mutations';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CreatePostFields } from '../../types/posts';
import CreateOrEditPostForm from './CreateOrEditPostForm';

const CreatePost = () => {
  const { setResponseError, username, userId } = useAuthContext();
  const history = useHistory();
  const toast = useToast();
  const localStoragePostCreate = useLocalStorage<CreatePostFields>('creatingPost');
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const [isDirty, setIsDirty] = React.useState(false); // temp workaround for reset btn (currently can't rely on formState's isDirty)

  if (!userId || !username) {
    return null;
  }

  React.useEffect(() => {
    const subscription = watch((value) => {
      const changesHaveBeenMade = !Object.values(value).every((v) => v === '');
      if (changesHaveBeenMade) {
        localStoragePostCreate.setLsItem(value as CreatePostFields);
      }
      setIsDirty(changesHaveBeenMade);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  React.useEffect(() => {
    const savedFormData = localStoragePostCreate.getLsItem();

    if (!savedFormData) {
      return;
    }

    const { title, contentUrl, body } = savedFormData;

    // pre-filling fields with unsaved changes if necessary
    reset({ title, contentUrl, body });

    toast({
      status: 'success',
      title: 'Loaded unsaved changes',
      position: 'top',
      duration: 3000,
      variant: 'pink',
    });
  }, []);

  const onSubmit = async (data: CreatePostFields): Promise<void> => {
    const newPostData = { userId, username, ...data };

    try {
      const newPostSlugs = await createPostMutation(newPostData);

      toast({
        position: 'top',
        title: 'Posted successfully',
        duration: 1600,
        status: 'success',
        variant: 'srSuccess',
      });

      localStoragePostCreate.removeLsItem();
      history.push({ pathname: `${newPostSlugs}` });
    } catch (err) {
      setResponseError(err);
    }
  };

  const handleReset = React.useCallback(() => {
    setIsDirty(false);
    localStoragePostCreate.removeLsItem();
    reset({ title: '', body: '', contentUrl: '' });
  }, [isDirty]);

  return (
    <CreateOrEditPostForm
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      isResetDisabled={!isDirty}
      handleReset={handleReset}
    />
  );
};

export default CreatePost;
