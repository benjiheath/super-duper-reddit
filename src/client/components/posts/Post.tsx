import { Box, Divider, Heading, HeadingProps, Text, Textarea, VStack } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { DbComment } from '../../../common/types/dbTypes';
import { usePostsContext } from '../../contexts/posts/PostsContext';
import { PostedBy } from '../../pages/Posts';
import { primaryColors } from '../../theme';
import { PostProps } from '../../types/posts';
import FormTextArea from '../generic/FormTextArea';
import PageBox from '../generic/PageBox';

interface PostTitleProps {
  title: string;
  contentUrl: string;
}

const PostTitle = (props: PostTitleProps) => {
  const { title, contentUrl } = props;

  const linkUrl = contentUrl ? `//${contentUrl}` : window.location.href;
  const headingStyles: HeadingProps = contentUrl
    ? { as: 'h3', mb: 2, _hover: { color: 'prim.800' }, transition: '0.2s' }
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
      <Text outline='1px solid' outlineColor='prim.200' p='10px 16px' w='100%' borderRadius={6}>
        {body}
      </Text>
      <span>{comments.length} comments</span>
    </VStack>
  );
};

const CommentBox = () => {
  const { register } = useForm();
  return <FormTextArea register={register} />;
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
      {comments.map((comment) => (
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

  const [post] = posts?.filter((post) => post.id.includes(id));

  return (
    <PageBox>
      <VStack width='100%' spacing={8}>
        <PostMain post={post} />
        <Divider />
        <CommentBox />
        <Comments comments={post.comments} />
      </VStack>
    </PageBox>
  );
};

export default Post;
