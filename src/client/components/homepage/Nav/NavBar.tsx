import { Box, Button, Flex, Heading, Icon, Spacer } from '@chakra-ui/react';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { Link, useHistory } from 'react-router-dom';
import UserMenu from './UserMenu';

const NavBar = () => {
  const history = useHistory();

  const isCreatingOrEditingPost =
    history.location.pathname === '/posts/create' || history.location.pathname.includes('posts/edit');

  const [linkTo, btnVariant, btnText, btnIcon] = isCreatingOrEditingPost
    ? ['/', 'basicHoverInv', 'Back', FaArrowLeft]
    : ['/posts/create', 'secondary', 'Create Post', FaPlus];

  return (
    <Box
      position='sticky'
      top={0}
      zIndex={1}
      bg='white'
      mb={8}
      boxShadow='0px 0px 3px 1px #ececec'
      w={'100vw'}
    >
      <Flex p='20px 0' w='800px' m='0 auto'>
        <Link to='/'>
          <Heading color='prim.800'>Super Reddit</Heading>
        </Link>
        <Spacer />
        <Link to={linkTo}>
          <Button mr={4} variant={btnVariant} onClick={() => isCreatingOrEditingPost && history.goBack()}>
            <Icon as={btnIcon} mr={2} />
            {btnText}
          </Button>
        </Link>
        <UserMenu />
      </Flex>
    </Box>
  );
};

export default NavBar;
