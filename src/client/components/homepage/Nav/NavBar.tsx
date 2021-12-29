import { Button, Flex, Heading, Icon, Spacer } from '@chakra-ui/react';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { Link, useHistory } from 'react-router-dom';
import UserMenu from './UserMenu';

const NavBar = () => {
  const { location } = useHistory();

  const [linkTo, btnVariant, btnText, btnIcon, btnColor] =
    location.pathname === '/posts/create'
      ? ['/', 'basicHoverInv', 'Back', FaArrowLeft, 'black']
      : ['/posts/create', 'secondary', 'Create Post', FaPlus, 'white'];

  return (
    <Flex position='sticky' top={0} zIndex={1} bg='white' p='20px 30px' mb='80px'>
      <Link to='/'>
        <Heading color='prim.800'>Super Reddit</Heading>
      </Link>
      <Spacer />
      <Link to={linkTo}>
        <Button mr={4} variant={btnVariant}>
          <Icon as={btnIcon} mr={2} />
          {btnText}
        </Button>
      </Link>
      <UserMenu />
    </Flex>
  );
};

export default NavBar;
