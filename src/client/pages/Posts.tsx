import { Flex, HStack, Link as ChakraLink, Text, VStack, Image } from '@chakra-ui/react';
import React from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import SrSpinner from '../components/generic/SrSpinner';
import { NavBar } from '../components/homepage';
import { NewPost } from '../components/posts';
import Post from '../components/posts/Post';
import Votes from '../components/posts/Votes';
import { usePostsContext } from '../contexts/posts/PostsContext';
import { useGlobalUserContext } from '../contexts/user/GlobalUserContext';
import { usePostsQuery } from '../hooks/queries';
import { PostProps } from '../types/posts';
import { checkIfUrlIsImg, getTimeAgo } from '../utils/misc';

interface PostedByProps {
  date: string;
  creatorUsername: string;
}

export const PostedBy = (props: PostedByProps) => {
  const { date, creatorUsername } = props;

  const timeAgo = getTimeAgo(date);
  // TODO - do this on server so it doesnt update in UI whenever a user votes

  return (
    <Flex color='gray.400'>
      <Text mr={2}>submitted {timeAgo} by * </Text>
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

  const image = checkIfUrlIsImg(post.contentUrl);

  return (
    <VStack alignItems='start' spacing={1}>
      <Text fontWeight='bold' fontSize={20}>
        {contentUrl}
      </Text>
      {image && post.contentUrl ? (
        <Image height='100px' objectFit='cover' src={post.contentUrl} alt='post image' borderRadius={4} />
      ) : null}
      <PostedBy date={post.createdAt} creatorUsername={post.creatorUsername} />
      <Text>{post.comments.length} comments</Text>
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
        <Votes item={post} mode='post' />
        <PostCardDetails post={post} />
      </HStack>
    </Link>
  );
};

const Posts = () => {
  const match = useRouteMatch();
  const { data, isLoading, isError } = usePostsQuery();

  const posts = data
    ? data
        .filter((post) => post.currentStatus !== 'removed')
        .map((post) => <PostCard post={post} key={post.id} />)
    : null;

  if (isLoading) {
    return (
      <>
        <NavBar />
        <SrSpinner />
      </>
    );
  }

  return (
    <Flex flexDir='column'>
      <NavBar />
      <Switch>
        <Route exact path={[`${match.path}/create`, `${match.path}/edit/:postSlugs`]}>
          <NewPost />
        </Route>
        <Route exact path='/posts/:postSlugs'>
          <Post />
        </Route>
        <Route path={`${match.path}/`}>
          <VStack spacing={4}>{posts}</VStack>
        </Route>
      </Switch>
    </Flex>
  );
};

export default Posts;
