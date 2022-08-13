import NotFound from './pages/NotFoundPage';
import { Flex } from '@chakra-ui/react';
import { NavBar } from './components/homepage';
import { PropsWithChildren } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AccountRecovery, PostsPage, RegisterOrLogin } from './pages';

export const App = () => {
  return (
    <Switch>
      <Route exact path='/'>
        <Redirect to='/posts' />
      </Route>
      <Route path='/posts'>
        <NavBar />
        <PostsPage />
      </Route>

      <Route exact path={['/register', '/login', '/reset-password', '/404']}>
        <Flex minH='100vh' alignItems='center'>
          <Route exact path={['/register', '/login']}>
            <RegisterOrLogin />
          </Route>
          <Route path='/reset-password'>
            <AccountRecovery />
          </Route>
          <Route exact path='/404'>
            <NotFound />
          </Route>
        </Flex>
      </Route>
    </Switch>
  );
};
