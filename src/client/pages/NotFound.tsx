import { Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import SrSpinner from '../components/generic/SrSpinner';

const NotFound = () => {
  const history = useHistory();

  React.useEffect(() => {
    setTimeout(() => {
      history.push({ pathname: 'posts' });
    }, 2500);
  }, []);

  return (
    <VStack minW='100%' spacing={5}>
      <Heading as='h1' fontWeight={800} color='prim.800'>
        404
      </Heading>
      <Text>Sorry, we couldn't load that resource</Text>
      <Text>Redirecting...</Text>
      <SrSpinner top='60%' left='49%' />
    </VStack>
  );
};

export default NotFound;
