import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { CreatePostRequest } from '../../../common/types';
import { useCreatePostMutation } from '../../hooks/mutations/useCreatePostMutation';
import { useSavedChanges } from '../../hooks/useSavedChanges';
import { useSuccessToast } from '../../hooks/useSrToast';
import CreateOrEditPostForm from './CreateOrEditPostForm';

const CreatePost = () => {
  const history = useHistory();
  const createPostMutation = useCreatePostMutation();
  const successToast = useSuccessToast();
  const { isDirty, clearSavedChanges, handleReset, formMethods } = useSavedChanges('editingPost');

  const { isSubmitting, errors } = formMethods.formState;

  const onSubmit = async (data: CreatePostRequest): Promise<void> => {
    const newPostSlugs = await createPostMutation.mutateAsync(data);

    successToast('Posted successfully', { variant: 'srSuccess' });
    clearSavedChanges();
    history.push(newPostSlugs);
  };

  return (
    <CreateOrEditPostForm
      handleSubmit={formMethods.handleSubmit}
      onSubmit={onSubmit}
      register={formMethods.register}
      errors={errors}
      isSubmitting={isSubmitting}
      isResetDisabled={!isDirty}
      handleReset={handleReset}
    />
  );
};

export default CreatePost;
