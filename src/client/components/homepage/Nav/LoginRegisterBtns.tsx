import { Button, Link } from '@chakra-ui/react';
import React from 'react';
import { Link as RRLink } from 'react-router-dom';

const LoginRegisterBtns = () => {
  return (
    <>
      <Link as={RRLink} mr={5} to='/login' color='white'>
        Login
      </Link>
      <Button color='pinkR.100'>
        <RRLink to='/register'>Register</RRLink>
      </Button>
    </>
  );
};

export default LoginRegisterBtns;
