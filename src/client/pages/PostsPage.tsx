import { Flex, VStack } from '@chakra-ui/react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { NavBar } from '../components/homepage';
import { CreatePost, EditPost, Post, Posts } from '../components/posts';

const PostsPage = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${match.path}/create`}>
        <CreatePost />
      </Route>
      <Route exact path={`${match.path}/edit/:postSlugs`}>
        <EditPost />
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
  );
};

export default PostsPage;
