import { Box, Button, VStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../contexts/user/AuthContext';
import { useAddCommentMutation } from '../../hooks/mutations';
import { CreateCommentFields } from '../../types/posts';
import { ButtonSubmit, FormTextArea } from '../generic';

interface CommentBoxProps {
  postId: string;
  postSlugs: string;
  parentCommentId?: string;
  stopReplying?: () => void;
}

const CommentBox = (props: CommentBoxProps) => {
  const { postId, parentCommentId, stopReplying, postSlugs } = props;
  const { username, userId, setResponseError } = useAuthContext();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({ mode: 'onChange' });

  const addCommentMutation = useAddCommentMutation({ postSlugs });

  const onSubmit = async (data: CreateCommentFields): Promise<void> => {
    const newCommentData = {
      body: data.body,
      postId,
      creatorUserId: userId!,
      creatorUsername: username!,
      parentCommentId: parentCommentId ?? null,
    };

    await addCommentMutation
      .mutateAsync(newCommentData)
      .then((_) => {
        stopReplying?.();
        reset();
      })
      .catch((err) => setResponseError(err));
  };

  return (
    <Box w='100%'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={2}>
          <FormTextArea
            register={register}
            minH={20}
            placeholder='Enter a comment...'
            errors={errors}
            required
          />
          <ButtonSubmit text='Save' isDisabled={!isValid} isLoading={isSubmitting} />
          {stopReplying && <Button onClick={stopReplying}>cancel</Button>}
        </VStack>
      </form>
    </Box>
  );
};

export default CommentBox;
