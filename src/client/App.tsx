import { ChakraProvider, Flex } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import ScrollToTop from './components/generic/ScrollToTop';
import PostsProvider from './contexts/posts/PostsContext';
import GlobalUserProvider from './contexts/user/GlobalUserContext';
import { AccountRecovery, PostsPage, Register } from './pages';
import NotFound from './pages/NotFoundPage';
import { theme } from './theme';

export const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <Router>
      <ScrollToTop />
      <Switch>
        <GlobalUserProvider>
          <ChakraProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              <PostsProvider>
                <Route exact path='/'>
                  <Redirect to='/posts' />
                </Route>
                <Route path='/posts'>
                  <PostsPage />
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
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </ChakraProvider>
        </GlobalUserProvider>
      </Switch>
    </Router>
  );
};
