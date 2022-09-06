import { Box, BoxProps, Button, Flex, HStack, VStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useAddCommentMutation } from '../../hooks/mutations/useAddCommentMutation';
import { CreateCommentFields } from '../../types/posts';
import { ButtonSubmit, FormTextArea } from '../generic';

interface CommentBoxProps extends BoxProps {
  postId: string;
  postSlugs: string;
  parentCommentId?: string;
  stopReplying?: () => void;
}

const CommentBox = (props: CommentBoxProps) => {
  const { postId, parentCommentId, stopReplying, postSlugs, ...rest } = props;
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({ mode: 'onChange' });

  const addCommentMutation = useAddCommentMutation({ postSlugs });

  const onSubmit = async ({ body }: CreateCommentFields): Promise<void> => {
    const newCommentData = { body, postId, parentCommentId };

    await addCommentMutation.mutateAsync(newCommentData).then(() => {
      stopReplying?.();
      reset();
    });
  };

  return (
    <Box w='100%' {...rest}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={2}>
          <FormTextArea
            register={register}
            minH={20}
            placeholder='Enter a comment...'
            errors={errors}
            required
          />
          <HStack alignItems='center'>
            <ButtonSubmit
              text='Save'
              isDisabled={!isValid}
              isLoading={isSubmitting}
              size={!!stopReplying ? 'sm' : 'md'}
            />
            {stopReplying && (
              <Button onClick={stopReplying} size='sm'>
                cancel
              </Button>
            )}
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};

export default CommentBox;
