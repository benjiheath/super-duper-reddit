import NotFound from './pages/NotFoundPage';
import { Flex } from '@chakra-ui/react';
import { NavBar } from './components/homepage';
import { PropsWithChildren } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AccountRecovery, PostsPage, RegisterOrLogin } from './pages';

const UnprotectedRoutes = (props: PropsWithChildren<{}>) => {
  return (
    <Route exact path={['/register', '/login', '/reset-password', '/404']}>
      <Flex minH='100vh' alignItems='center'>
        {props.children}
      </Flex>
    </Route>
  );
};

const ProtectedRoutes = (props: PropsWithChildren<{}>) => {
  return (
    <Route path={['/', '/posts']}>
      <NavBar />
      {props.children}
    </Route>
  );
};

export const App = () => {
  return (
    <Switch>
      <ProtectedRoutes>
        <Route exact path='/' children={<Redirect to='posts' />} />
        <Route path='/posts' component={PostsPage} />
      </ProtectedRoutes>

      <UnprotectedRoutes>
        <Route exact path={['/register', '/login']} component={RegisterOrLogin} />
        <Route path='/reset-password' component={AccountRecovery} />
        <Route exact path='/404' component={NotFound} />
      </UnprotectedRoutes>
    </Switch>
  );
};
