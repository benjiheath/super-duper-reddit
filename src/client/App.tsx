import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PostsProvider from './contexts/posts/PostsContext';
import GlobalUserProvider from './contexts/user/GlobalUserContext';
import { Home, Posts, Register, AccountRecovery } from './pages';
import Test from './pages/Test';
import { theme } from './theme';

export const App = () => (
  <Router>
    <Switch>
      <GlobalUserProvider>
        <PostsProvider>
          <ChakraProvider theme={theme}>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route path='/posts'>
              <Posts />
            </Route>
            <Route exact path={['/register', '/login']}>
              <Register />
            </Route>
            <Route path='/reset-password'>
              <AccountRecovery />
            </Route>
            <Route exact path='/test'>
              <Test />
            </Route>
          </ChakraProvider>
        </PostsProvider>
      </GlobalUserProvider>
    </Switch>
  </Router>
);
