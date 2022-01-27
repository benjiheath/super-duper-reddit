import { Flex, VStack } from '@chakra-ui/react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { NavBar } from '../components/homepage';
import { CreateOrEditPost, Post, Posts } from '../components/posts';

const PostsPage = () => {
  const match = useRouteMatch();

  return (
    <Flex flexDir='column'>
      <NavBar />
      <Switch>
        <Route exact path={[`${match.path}/create`, `${match.path}/edit/:postSlugs`]}>
          <CreateOrEditPost />
        </Route>
        <Route exact path='/posts/:postSlugs'>
          <Post />
        </Route>
        <Route path={`${match.path}/`}>
          <VStack spacing={4}>
            <Posts />
          </VStack>
        </Route>
      </Switch>
    </Flex>
  );
};

export default PostsPage;
