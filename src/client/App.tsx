import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AccountRecovery, PostsPage, RegisterOrLogin } from './pages';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useHandleHttpError } from './hooks/useHandleHttpError';
import { NavBar } from './components/homepage';
import { Flex } from '@chakra-ui/react';
import NotFound from './pages/NotFoundPage';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const App = () => {
  const handleHttpError = useHandleHttpError();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
    mutationCache: new MutationCache({
      onError: handleHttpError,
    }),
    queryCache: new QueryCache({
      onError: handleHttpError,
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>
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
            <Route path='/404'>
              <NotFound />
            </Route>
          </Flex>
        </Route>
      </Switch>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
