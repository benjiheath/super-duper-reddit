import { useHistory, useParams } from 'react-router-dom';
import { CreatePostRequest } from '../../../common/types';
import { useEditPostMutation } from '../../hooks/mutations/useEditPostMutation';
import { usePostQuery } from '../../hooks/queries/usePostQuery';
import { useSavedChanges } from '../../hooks/useSavedChanges';
import { useSuccessToast } from '../../hooks/useSrToast';
import CreateOrEditPostForm from './CreateOrEditPostForm';

const EditPost = () => {
  const { postSlugs } = useParams() as { postSlugs: string };
  const { data: post } = usePostQuery({ postSlugs });
  const editPostMutation = useEditPostMutation();
  const history = useHistory();
  const successToast = useSuccessToast();
  const { isDirty, clearSavedChanges, handleReset, formMethods } = useSavedChanges('editingPost', post);

  const { isSubmitting, errors } = formMethods.formState;

  const onSubmit = async (data: CreatePostRequest): Promise<void> => {
    await editPostMutation.mutateAsync({ ...data, postSlugs });

    successToast('Post updated successfully', { variant: 'srSuccessSubtle' });

    clearSavedChanges();
    history.push(`/posts/${postSlugs}`);
  };

  return (
    <CreateOrEditPostForm
      handleSubmit={formMethods.handleSubmit}
      onSubmit={onSubmit}
      register={formMethods.register}
      errors={errors}
      isSubmitting={isSubmitting}
      handleReset={handleReset}
      isResetDisabled={!isDirty}
      postSlugs={postSlugs}
    />
  );
};

export default EditPost;
