import { Box, Button, VStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { CommentType, PostType } from '../../../common/types/entities';
import { usePostsContext } from '../../contexts/posts/PostsContext';
import { useGlobalUserContext } from '../../contexts/user/GlobalUserContext';
import { PostProps, CreateCommentFields } from '../../types/posts';
import { axiosPOST } from '../../utils/axiosMethods';
import { FormTextArea, ButtonSubmit } from '../generic';

interface CommentBoxProps {
  postId: string;
  parentCommentId?: string;
  stopReplying?: () => void;
}

const CommentBox = (props: CommentBoxProps) => {
  const { postId, parentCommentId, stopReplying } = props;
  const { username, userId, setResponseError } = useGlobalUserContext();
  const { setPostInView } = usePostsContext();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (data: CreateCommentFields): Promise<void> => {
    try {
      const newCommentData = {
        ...data,
        post_id: postId,
        creator_user_id: userId,
        creator_username: username,
        parent_comment_id: parentCommentId ?? null,
      };

      const { post } = await axiosPOST('posts/comments', { data: newCommentData });

      if (!post) {
        return;
        // TODO - handle later
      }

      setPostInView(post);
      if (stopReplying) stopReplying();
      reset();
    } catch (err) {
      setResponseError(err);
    }
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
