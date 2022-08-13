import React from 'react';
import { App } from './App';
import ReactDOM from 'react-dom';
import { theme } from './theme';
import AuthProvider from './contexts/user/AuthContext';
import { ScrollToTop } from './components/generic';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

const main = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return ReactDOM.render(
    <React.StrictMode>
      <Router>
        <ChakraProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <ScrollToTop />
              <App />
              <ReactQueryDevtools initialIsOpen={false} />
            </AuthProvider>
          </QueryClientProvider>
        </ChakraProvider>
      </Router>
    </React.StrictMode>,
    document.getElementById('root')
  );
};

main();
