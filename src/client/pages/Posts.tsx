import { Box, Flex, HStack, Link as ChakraLink, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { NavBar } from '../components/homepage';
import { NewPost } from '../components/posts';
import Post from '../components/posts/Post';
import { usePostsContext } from '../contexts/posts/PostsContext';
import { useGlobalUserContext } from '../contexts/user/GlobalUserContext';
import { PostProps } from '../types/posts';

interface PostedByProps {
  date: string;
  creatorUsername: string;
}

export const PostedBy = (props: PostedByProps) => {
  const { date, creatorUsername } = props;

  const parsedDate = new Date(Date.parse(date)).toISOString();

  return (
    <Flex>
      <Text mr={2}>submitted {parsedDate} by * </Text>
      <Text color='prim.800' display='inline-block' fontWeight='700'>
        {creatorUsername}
      </Text>
    </Flex>
  );
};

const PostCardDetails = (props: PostProps) => {
  const { post } = props;
  const date = new Date(Date.parse(post.createdAt)).toISOString();

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
    <Flex flexDir='column'>
      <Text>{contentUrl}</Text>
      <PostedBy date={post.createdAt} creatorUsername={post.creatorUsername} />
      <Text>{post.comments.length} comments</Text>
    </Flex>
  );
};

const PostCard = (props: PostProps) => {
  const { post } = props;

  return (
    <Link to={`/posts/${post.urlSlugs}`}>
      <HStack
        spacing={6}
        width='800px'
        boxShadow='0px 0px 5px 1px #a0a0a028'
        p={4}
        borderRadius={8}
        cursor='pointer'
        _hover={{
          boxShadow: '0px 0px 1px 1px #cfcfcf28',
        }}
        bg='white'
        transition='0.15s'
      >
        <span>votes</span>
        <Box>img</Box>
        <PostCardDetails post={post} />
      </HStack>
    </Link>
  );
};

const Posts = () => {
  const match = useRouteMatch();
  const { posts } = usePostsContext();

  return (
    <Switch>
      <Flex flexDir='column'>
        <NavBar />
        <Route exact path={`${match.path}/`}>
          <VStack spacing={6}>
            {posts
              ? posts
                  .filter((post) => post.currentStatus !== 'removed')
                  .map((post) => <PostCard post={post} />)
              : null}
          </VStack>
        </Route>
        <Route path='/posts/:id/:title'>
          <Post />
        </Route>
        <Route path={`${match.path}/create`}>
          <NewPost />
        </Route>
      </Flex>
    </Switch>
  );
};

export default Posts;
