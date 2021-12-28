import { Box, Flex, VStack, Text, HStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { PostWithComments } from '../../common/types/dbTypes';
import { postsRouter } from '../../server/routes';
import { NavBar } from '../components/homepage';
import { NewPost } from '../components/posts';
import { usePostsContext } from '../contexts/posts/PostsContext';
import { useGlobalUserContext } from '../contexts/user/GlobalUserContext';
import { axiosRequest } from '../utils/axiosMethods';

interface PostProps {
  post: PostWithComments;
}

const PostDetails = (props: PostProps) => {
  const { post } = props;
  const date = new Date(Date.parse(post.created_at)).toISOString();

  return (
    <Flex flexDir='column'>
      <Text>{post.title}</Text>
      <Text>submitted {date}</Text>
      <Text>{post.comments.length} comments</Text>
    </Flex>
  );
};

const Post = (props: PostProps) => {
  const { post } = props;
  return (
    <HStack
      spacing={6}
      width='800px'
      boxShadow='0px 0px 10px 1px #8a8a8a28'
      p={4}
      borderRadius={8}
      cursor='pointer'
    >
      <span>votes</span>
      <Box>img</Box>
      <PostDetails post={post} />
    </HStack>
  );
};

const Posts = () => {
  const match = useRouteMatch();
  const { setResponseError } = useGlobalUserContext();
  const { posts, setPosts } = usePostsContext();

  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data: posts } = await axiosRequest('GET', 'posts');

        setPosts(posts!);
        console.log('posts:', posts);
      } catch (err) {
        setResponseError(err);
      }
    };

    getPosts();
  }, []);

  // getPosts();

  // if (!authorized) {
  //   location.push({ pathname: '/login' });
  // }

  return (
    <Switch>
      <Flex flexDir='column'>
        <NavBar />
        <Route path={`${match.path}/create`}>
          <NewPost />
        </Route>
        <VStack spacing={6}>{posts ? posts.map((post) => <Post post={post} />) : null}</VStack>
      </Flex>
    </Switch>
  );
};

export default Posts;
