import { VStack } from '@chakra-ui/react';
import { DeepMap, FieldError, FieldValues, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import { inputFields } from '../../constants';
import { CreatePostFields } from '../../types/posts';
import { ButtonSubmit, FormBox, FormTextArea } from '../generic';
import { InputFields } from '../register/InputFields';

interface Props {
  postSlugs?: string;
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  onSubmit: (data: CreatePostFields) => Promise<void>;
  register: UseFormRegister<FieldValues>;
  errors: DeepMap<FieldValues, FieldError>;
  isSubmitting: boolean;
}

const CreateOrEditPostForm = (props: Props) => {
  const { postSlugs, handleSubmit, onSubmit, register, errors, isSubmitting } = props;
  return (
    <FormBox title={postSlugs ? 'Edit post' : 'New Post'} headingSize='lg' w='800px'>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <VStack spacing='10px' m='0 auto'>
          <InputFields inputFields={inputFields.createPost} register={register} errors={errors} />
          <FormTextArea labelTitle='Body' register={register} errors={errors} />
          <ButtonSubmit text={postSlugs ? 'Save' : 'Submit'} isLoading={isSubmitting} />
        </VStack>
      </form>
    </FormBox>
  );
};

export default CreateOrEditPostForm;
