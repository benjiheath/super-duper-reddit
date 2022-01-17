import { ChakraProvider, Flex } from '@chakra-ui/react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import ScrollToTop from './components/generic/ScrollToTop';
import PostsProvider from './contexts/posts/PostsContext';
import GlobalUserProvider from './contexts/user/GlobalUserContext';
import { AccountRecovery, Posts, Register } from './pages';
import NotFound from './pages/NotFound';
import { theme } from './theme';

export const App = () => (
  <Router>
    <ScrollToTop />
    <Switch>
      <GlobalUserProvider>
        <ChakraProvider theme={theme}>
          <PostsProvider>
            <Route exact path='/'>
              <Redirect to='/posts' />
            </Route>
            <Route path='/posts'>
              <Posts />
            </Route>
          </PostsProvider>
          <Flex minH='100vh' alignItems='center'>
            <Route exact path={['/register', '/login']}>
              <Register />
            </Route>
            <Route path='/reset-password'>
              <AccountRecovery />
            </Route>
            <Route exact path='/404'>
              <NotFound />
            </Route>
          </Flex>
        </ChakraProvider>
      </GlobalUserProvider>
    </Switch>
  </Router>
);
