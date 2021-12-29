import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { Link, Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { NavBar } from '../components/homepage';
import { NewPost } from '../components/posts';
import Post from '../components/posts/Post';
import { usePostsContext } from '../contexts/posts/PostsContext';
import { useGlobalUserContext } from '../contexts/user/GlobalUserContext';
import { PostProps } from '../types/posts';
import { axiosRequest } from '../utils/axiosMethods';
import { createPostSlugs } from '../utils/misc';

const PostCardDetails = (props: PostProps) => {
  const { post } = props;
  const date = new Date(Date.parse(post.created_at)).toISOString();

  return (
    <Flex flexDir='column'>
      <Text>{post.title}</Text>
      <Text>
        submitted {date} * by {post.creator_username}
      </Text>
      <Text>{post.comments.length} comments</Text>
    </Flex>
  );
};

const PostCard = (props: PostProps) => {
  const { post } = props;

  const slugs = createPostSlugs(post.id, post.title);

  return (
    <Link to={`/posts/${slugs}`}>
      <HStack
        spacing={6}
        width='800px'
        boxShadow='0px 0px 5px 1px #a0a0a028'
        p={4}
        borderRadius={8}
        cursor='pointer'
        _hover={{
          boxShadow: '0px 0px 1px 1px #c4c4c428',
        }}
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
        <Route exact path={`${match.path}/`}>
          <VStack spacing={6}>{posts ? posts.map((post) => <PostCard post={post} />) : null}</VStack>
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
