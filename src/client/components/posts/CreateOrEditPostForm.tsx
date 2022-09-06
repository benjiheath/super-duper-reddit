import { Box, Button, Grid, Icon, VStack } from '@chakra-ui/react';
import { DeepMap, FieldError, FieldValues, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import { FaUndo } from 'react-icons/fa';
import { CreatePostRequest } from '../../../common/types';
import { inputFields } from '../../constants';
import { ButtonSubmit, FormBox, FormTextArea } from '../generic';
import { InputFields } from '../resisterAndLogin/InputFields';

interface Props {
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  onSubmit: (data: CreatePostRequest) => Promise<void>;
  register: UseFormRegister<FieldValues>;
  errors: DeepMap<FieldValues, FieldError>;
  isSubmitting: boolean;
  handleReset: () => void;
  isResetDisabled: boolean;
  postSlugs?: string;
}

const CreateOrEditPostForm = (props: Props) => {
  const { postSlugs, handleSubmit, onSubmit, register, errors, isSubmitting, handleReset, isResetDisabled } =
    props;

  return (
    <FormBox title={postSlugs ? 'Edit post' : 'New Post'} headingSize='lg' w='800px'>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <VStack spacing='10px' m='0 auto'>
          <InputFields inputFields={inputFields.createPost} register={register} errors={errors} />
          <FormTextArea labelTitle='Body' register={register} errors={errors} />
          <Grid templateColumns='1fr 1fr 1fr' w='100%' mt='20px !important'>
            <Box />
            <ButtonSubmit
              text={postSlugs ? 'Save' : 'Submit'}
              isLoading={isSubmitting}
              justifySelf='center'
            />
            <Button
              variant='basicHoverInv'
              justifySelf='flex-end !important'
              onClick={handleReset}
              isDisabled={isResetDisabled}
            >
              <Icon as={FaUndo} mr={2} mt={1} h='14px !important' />
              Reset
            </Button>
          </Grid>
        </VStack>
      </form>
    </FormBox>
  );
};

export default CreateOrEditPostForm;
