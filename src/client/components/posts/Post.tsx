import { Box, Divider, Heading, HeadingProps, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { CommentType, PostType } from '../../../common/types/entities';
import { usePostsContext } from '../../contexts/posts/PostsContext';
import { useGlobalUserContext } from '../../contexts/user/GlobalUserContext';
import { PostedBy } from '../../pages/Posts';
import { CreateCommentFields, PostProps } from '../../types/posts';
import { axiosPOST } from '../../utils/axiosMethods';
import ButtonSubmit from '../generic/ButtonSubmit';
import FormTextArea from '../generic/FormTextArea';
import PageBox from '../generic/PageBox';
import SrSpinner from '../generic/SrSpinner';

type PostTitleProps = Pick<PostType, 'title' | 'contentUrl'>;

const PostTitle = (props: PostTitleProps) => {
  const { title, contentUrl } = props;

  const linkUrl = contentUrl ? `//${contentUrl}` : window.location.href;
  const headingStyles: HeadingProps = contentUrl
    ? { mb: 2, _groupHover: { color: 'prim.800' }, transition: '0.4s' }
    : {};

  return (
    <a href={linkUrl} target='_blank' role='group'>
      <Heading as='h3' fontSize={26} {...headingStyles}>
        {title}
      </Heading>
      {contentUrl ? (
        <Box
          h={1}
          bg='prim.100'
          w='20%'
          mb={2}
          borderRadius={2}
          _groupHover={{ width: '25%', bg: 'prim.800', ml: 1 }}
          transition='0.4s'
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
    creatorUserId,
    creatorUsername,
    currentStatus,
    updatedAt,
    createdAt,
    contentUrl,
    urlSlugs,
  } = post;

  return (
    <VStack alignItems='start' width='100%'>
      <PostTitle title={title} contentUrl={contentUrl} />
      <PostedBy date={createdAt} creatorUsername={post.creatorUsername} />
      {body ? (
        <Text
          outline='1px solid'
          bg='prim.50'
          outlineColor='prim.200'
          p='10px 16px'
          w='100%'
          borderRadius={6}
        >
          {body}
        </Text>
      ) : null}
      <span>{comments.length} comments</span>
    </VStack>
  );
};

const CommentBox = (props: PostProps) => {
  const { post } = props;
  const { id: postID } = post;
  const { username, userId, setResponseError } = useGlobalUserContext();
  const { setPost } = usePostsContext();
  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (data: CreateCommentFields): Promise<void> => {
    try {
      const newCommentData = {
        ...data,
        post_id: postID,
        creator_user_id: userId,
        creator_username: username,
      };

      const { post } = await axiosPOST('posts/comments', { data: newCommentData });

      if (!post) {
        return;
        // TODO - handle later
      }

      setPost(post);
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
        </VStack>
      </form>
    </Box>
  );
};

interface CommentProps {
  comments: CommentType[];
}

const Comments = (props: CommentProps) => {
  const { comments } = props;

  if (comments.length === 0) {
    return <Text>No comments to display.</Text>;
  }

  return (
    <>
      {comments.map((comment) => (
        <span>{comment.body}</span>
      ))}
    </>
  );
};

const Post = () => {
  const { postSlugs } = useParams() as { postSlugs: string };
  const { postsLoading, post, getPost, setPost } = usePostsContext();

  React.useEffect(() => {
    if (!post) {
      getPost(postSlugs);
    }

    return () => {
      setPost(null);
    };
  }, []);

  if (postsLoading || !post) {
    return <SrSpinner />;
  }

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
