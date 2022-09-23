import React from 'react';
import { FaUndo } from 'react-icons/fa';
import { Toggler } from '../generic/Toggler';
import { InputFields } from '../resisterAndLogin/InputFields';
import { inputFields } from '../../constants';
import { CreatePostRequest } from '../../../common/types';
import { Box, Button, Grid, Icon, VStack } from '@chakra-ui/react';
import { ButtonSubmit, FormBox, FormTextArea } from '../generic';
import { DeepMap, FieldError, FieldValues, UseFormReturn } from 'react-hook-form';
import { getYoutubeTitle, isYoutubeUrl as checkIsYoutubeUrl } from '../../utils/misc';

interface Props {
  onSubmit: (data: CreatePostRequest) => Promise<void>;
  formMethods: UseFormReturn;
  errors: DeepMap<FieldValues, FieldError>;
  isSubmitting: boolean;
  handleReset: () => void;
  isResetDisabled: boolean;
  postSlugs?: string;
}

const CreateOrEditPostForm = (props: Props) => {
  const { postSlugs, formMethods, onSubmit, errors, isSubmitting, handleReset, isResetDisabled } = props;
  const [isValidYoutubeUrl, setIsValidYoutubeUrl] = React.useState(false);
  const [useYoutubeTitle, toggleUseYoutubeTitle] = React.useReducer((prev) => !prev, false);
  const values = formMethods.watch();

  React.useEffect(() => {
    const isYoutubeUrl = checkIsYoutubeUrl(values.contentUrl);

    if (!isYoutubeUrl) {
      setIsValidYoutubeUrl(false);
      return;
    }

    getYoutubeTitle(values.contentUrl).then((youtubeTitle) => {
      if (values.title !== youtubeTitle) {
        setIsValidYoutubeUrl(Boolean(youtubeTitle));
      }

      if (useYoutubeTitle && youtubeTitle && values.title !== youtubeTitle) {
        formMethods.setValue('title', youtubeTitle);
      } else if (!useYoutubeTitle && values.title === youtubeTitle) {
        formMethods.resetField('title');
      }
    });
  }, [values, useYoutubeTitle]);

  return (
    <FormBox title={postSlugs ? 'Edit post' : 'New Post'} headingSize='lg' w='800px'>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <VStack spacing='10px' m='0 auto'>
          <InputFields
            inputFields={inputFields.createPost}
            register={formMethods.register}
            errors={errors}
            renderSibling={{
              title: () => (
                <Toggler label='Use video title?' onToggle={toggleUseYoutubeTitle} show={isValidYoutubeUrl} />
              ),
            }}
          />
          <FormTextArea labelTitle='Body' register={formMethods.register} errors={errors} />
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
