import { Flex, HStack, Image, Link as ChakraLink, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Votes } from '.';
import { PostType } from '../../../common/types';
import { usePostsQuery } from '../../hooks/queries/usePostsQuery';
import { SrSpinner } from '../generic';
import { PostContent } from './Post';

interface PostedByProps {
  createdAtRelative: string;
  creatorUsername: string;
}

interface PostProps {
  post: PostType;
}

export const PostedBy = (props: PostedByProps) => {
  const { createdAtRelative, creatorUsername } = props;

  return (
    <Flex color='gray.400'>
      <Text mr={2}>submitted {createdAtRelative} by * </Text>
      <Text color='prim.800' display='inline-block' fontWeight='700'>
        {creatorUsername}
      </Text>
    </Flex>
  );
};

const PostCardDetails = (props: PostProps) => {
  const { post } = props;

  const contentUrl = post.contentUrl ? (
    <ChakraLink
      href={`//${post.contentUrl}`}
      target='_blank'
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={{}}
    >
      {post.title}
    </ChakraLink>
  ) : (
    post.title
  );

  return (
    <VStack alignItems='start' spacing={1}>
      <Text fontWeight='bold' fontSize={20}>
        {contentUrl}
      </Text>
      <PostContent contentUrl={post.contentUrl} height='100px' borderRadius={4} compact />
      <PostedBy createdAtRelative={post.createdAtRelative} creatorUsername={post.creatorUsername} />
      <Text>{post.commentCount} comments</Text>
    </VStack>
  );
};

const PostCard = (props: PostProps) => {
  const { post } = props;

  return (
    <Link to={`/posts/${post.urlSlugs}`}>
      <HStack
        spacing={6}
        width='800px'
        boxShadow='0px 0px 3px 1px #bebebe28'
        p='12px 30px'
        borderRadius={8}
        cursor='pointer'
        _hover={{
          boxShadow: '0px 0px 1px 1px #ececec28',
          bg: '#fefefe',
        }}
        bg='white'
        transition='0.15s'
      >
        <Votes item={post} mode='post' postId={post.id} postSlugs={post.urlSlugs} />
        <PostCardDetails post={post} />
      </HStack>
    </Link>
  );
};

const Posts = () => {
  const { data, isLoading, error, isFetching } = usePostsQuery();

  if (error) {
    return <span>Error fetching posts</span>;
  }

  if (isLoading || isFetching) {
    return <SrSpinner />;
  }

  return (
    <VStack spacing={4}>
      {data
        ? data
            .filter((post) => post.currentStatus !== 'removed')
            .map((post) => <PostCard post={post} key={post.id} />)
        : null}
    </VStack>
  );
};

export default Posts;
