import { Divider, Heading, Text, Textarea, VStack } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { DbComment } from '../../../common/types/dbTypes';
import { usePostsContext } from '../../contexts/posts/PostsContext';
import { PostProps } from '../../types/posts';
import FormTextArea from '../generic/FormTextArea';
import PageBox from '../generic/PageBox';

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
  } = post;

  return (
    <VStack alignItems='start' width='100%'>
      <Heading as='h3'>{title}</Heading>
      <span>
        {created_at} * by{' '}
        <Text color='prim.800' display='inline-block' fontWeight='700'>
          {creator_username}
        </Text>
      </span>
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
