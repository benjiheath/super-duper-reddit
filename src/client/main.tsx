import React from 'react';
import { App } from './App';
import ReactDOM from 'react-dom';
import { theme } from './theme';
import AuthProvider from './contexts/user/AuthContext';
import { ScrollToTop } from './components/generic';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

const main = () => {
  return ReactDOM.render(
    <React.StrictMode>
      <Router>
        <ChakraProvider theme={theme}>
            <AuthProvider>
              <ScrollToTop />
              <App />
              <ReactQueryDevtools initialIsOpen={false} />
            </AuthProvider>
        </ChakraProvider>
      </Router>
    </React.StrictMode>,
    document.getElementById('root')
  );
};

main();
