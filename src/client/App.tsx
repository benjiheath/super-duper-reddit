import { ChakraProvider, Flex } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import ScrollToTop from './components/generic/ScrollToTop';
import AuthProvider from './contexts/user/AuthContext';
import { AccountRecovery, PostsPage, RegisterOrLogin } from './pages';
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
        <ChakraProvider theme={theme}>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <Route exact path='/'>
                <Redirect to='/posts' />
              </Route>
              <Route path='/posts'>
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
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </AuthProvider>
        </ChakraProvider>
      </Switch>
    </Router>
  );
};
