import { Box, Divider, Flex, Heading, HeadingProps, Text, Textarea, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { DbComment } from '../../../common/types/dbTypes';
import { usePostsContext } from '../../contexts/posts/PostsContext';
import { useGlobalUserContext } from '../../contexts/user/GlobalUserContext';
import { PostedBy } from '../../pages/Posts';
import { primaryColors } from '../../theme';
import { CreateCommentFields, PostProps } from '../../types/posts';
import { axiosRequest } from '../../utils/axiosMethods';
import ButtonSubmit from '../generic/ButtonSubmit';
import FormTextArea from '../generic/FormTextArea';
import PageBox from '../generic/PageBox';
import AlertPop from '../register/AlertPop';

interface PostTitleProps {
  title: string;
  contentUrl: string;
}

const PostTitle = (props: PostTitleProps) => {
  const { title, contentUrl } = props;

  const linkUrl = contentUrl ? `//${contentUrl}` : window.location.href;
  const headingStyles: HeadingProps = contentUrl
    ? { as: 'h3', mb: 2, _hover: { color: 'prim.800' }, transition: '0.1s' }
    : { as: 'h3' };

  return (
    <a href={linkUrl} target='_blank' role='group'>
      <Heading {...headingStyles}>{title}</Heading>
      {contentUrl ? (
        <Box
          h={1.5}
          bg='prim.100'
          w='20%'
          mb={2}
          borderRadius={2}
          _groupHover={{ width: '25%', bg: 'prim.800' }}
          transition='0.2s'
        />
      ) : null}
    </a>
  );
};

const PostMain = (props: PostProps) => {
  const { post } = props;
  const {
    id,
    body,
    title,
    comments,
    creator_user_id,
    created_at,
    updated_at,
    current_status,
    creator_username,
    content_url,
  } = post;

  return (
    <VStack alignItems='start' width='100%'>
      <PostTitle title={title} contentUrl={content_url} />
      <PostedBy date={post.created_at} creatorUsername={post.creator_username} />
      <Text outline='1px dotted' outlineColor='prim.200' p='10px 16px' w='100%' borderRadius={6}>
        {body}
      </Text>
      <span>{comments.length} comments</span>
    </VStack>
  );
};

const CommentBox = (props: PostProps) => {
  const { post } = props;
  const { id: postID, comments } = post;
  const { username, userID, setResponseError } = useGlobalUserContext();
  const { posts, updatePost } = usePostsContext();
  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm({ mode: 'onChange' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CreateCommentFields): Promise<void> => {
    try {
      const newCommentData = {
        ...data,
        post_id: postID,
        creator_user_id: userID,
        creator_username: username,
      };

      const { comment: addedComment } = await axiosRequest('POST', 'posts/comments', newCommentData);

      if (!addedComment) {
        return;
        // TODO handle later
      }

      const updatedPost = { ...post, comments: [addedComment, ...comments] };

      if (!posts) {
        return;
        // TODO handle later. Do this guard check elswhere? mb higher up
      }

      setPosts([updatedPost, ...posts]);
      reset();
    } catch (err) {
      setResponseError(err);
    }
  };

  return (
    <Box w='100%'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={2}>
          <FormTextArea register={register} minH={20} placeholder='Enter a comment ...' />
          {errors.body && <AlertPop title={errors.body.message} />}
          <ButtonSubmit text='Save' isDisabled={!isValid} isLoading={isSubmitting} />
          {isSubmitting && <span>xxxxxxx</span>}
        </VStack>
      </form>
    </Box>
  );
};

interface CommentProps {
  comments: DbComment[];
}

const Comments = (props: CommentProps) => {
  const { comments } = props;

  if (comments.length === 0) {
    return <Text>No comments to display.</Text>;
  }

  return (
    <>
      {comments.map(comment => (
        <span>{comment.body}</span>
      ))}
    </>
  );
};

const Post = () => {
  const { id } = useParams() as { id: string };
  const { posts } = usePostsContext();

  if (!posts) {
    return <Text>Error retrieving posts</Text>;
  }

  const [post] = posts?.filter(post => post.id.includes(id));

  return (
    <PageBox>
      <VStack width='100%' spacing={8}>
        <PostMain post={post} />
        <Divider />
        <CommentBox post={post} />
        <Comments comments={post.comments} />
      </VStack>
    </PageBox>
  );
};

export default Post;
