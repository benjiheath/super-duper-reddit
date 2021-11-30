import { Button, Flex, Heading, Icon, Spacer } from '@chakra-ui/react';
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';

const NavBar = () => {
  return (
    <Flex
      position='sticky'
      top={0}
      zIndex={1}
      bg='prim.300'
      p='20px 30px'
      align='center'
      justify='flex-end'
      mb='100px'
    >
      <Heading color='sec.100'>Super Reddit</Heading>
      <Spacer />
      <Link to='/posts/create'>
        <Button color='white' mr={4} variant='secondary'>
          <Icon as={FaPlus} mr={2} />
          Create Post
        </Button>
      </Link>
      <UserMenu />
    </Flex>
  );
};

export default NavBar;
